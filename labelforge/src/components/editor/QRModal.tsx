'use client';
import { useState } from 'react';
import { X, QrCode, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SIZES = [15, 20, 30, 40];

interface Props {
  onClose: () => void;
}

export default function QRModal({ onClose }: Props) {
  const [content, setContent] = useState('');
  const [size, setSize] = useState(25);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [generating, setGenerating] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  async function generate() {
    const text = content.trim();
    if (!text) return;
    setGenerating(true);
    setError('');
    try {
      const QRCode = (await import('qrcode')).default;
      const url = await QRCode.toDataURL(text, {
        width: 400,
        margin: 1,
        color: { dark: '#000000ff', light: '#ffffffff' },
        errorCorrectionLevel: 'M',
      });
      setQrDataUrl(url);
    } catch (_) {
      setError('Failed to generate QR code. Check the content and try again.');
    } finally {
      setGenerating(false);
    }
  }

  function addToCanvas() {
    if (!qrDataUrl) return;
    (window as any).__lf_addQRCode?.(qrDataUrl, size);
    setAdded(true);
    setTimeout(onClose, 700);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-forge-surface border border-forge-border rounded-2xl shadow-2xl w-full max-w-sm mx-4 flex flex-col">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-forge-border">
          <QrCode className="w-4 h-4 text-forge-accent" />
          <h2 className="text-sm font-semibold text-forge-text flex-1">QR Code Generator</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-forge-panel text-forge-muted hover:text-forge-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs text-forge-muted mb-1.5">Content (URL, text, or product code)</p>
            <input
              type="text"
              value={content}
              onChange={(e) => { setContent(e.target.value); setQrDataUrl(''); setAdded(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter') generate(); }}
              placeholder="https://yourbrand.com"
              className="w-full bg-forge-panel border border-forge-border rounded-lg px-3 py-2 text-sm text-forge-text placeholder:text-forge-dim focus:outline-none focus:border-forge-accent transition-colors"
            />
            {error && <p className="text-xs text-forge-error mt-1">{error}</p>}
          </div>

          <div>
            <p className="text-xs text-forge-muted mb-1.5">Size on label</p>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    'flex-1 py-1.5 rounded-lg text-xs border transition-all',
                    size === s
                      ? 'border-forge-accent bg-forge-accent/10 text-forge-accent'
                      : 'border-forge-border text-forge-muted hover:text-forge-text'
                  )}
                >
                  {s}mm
                </button>
              ))}
            </div>
          </div>

          {qrDataUrl && (
            <div className="flex justify-center py-2">
              <div className="bg-white p-3 rounded-xl shadow-inner">
                <img src={qrDataUrl} alt="QR Code preview" width={120} height={120} />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 px-5 pb-5">
          <Button variant="secondary" size="sm" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          {!qrDataUrl ? (
            <Button variant="primary" size="sm" onClick={generate} loading={generating} className="flex-1">
              Generate
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={addToCanvas}
              icon={added ? <CheckCircle2 className="w-3.5 h-3.5" /> : undefined}
              className="flex-1"
            >
              {added ? 'Added!' : 'Add to Canvas'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
