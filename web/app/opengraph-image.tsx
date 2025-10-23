import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AI Web Agency - Marketing Numérique Québec';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1e40af',
          backgroundImage: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        }}
      >
        {/* Logo/Brand Area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              backgroundColor: 'white',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 24,
            }}
          >
            <div
              style={{
                fontSize: 40,
                fontWeight: 'bold',
                color: '#1e40af',
              }}
            >
              AI
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                lineHeight: 1,
              }}
            >
              AI Web Agency
            </div>
            <div
              style={{
                fontSize: 24,
                opacity: 0.9,
                marginTop: 8,
              }}
            >
              Marketing Numérique Québec
            </div>
          </div>
        </div>

        {/* Main Headline */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: 1000,
          }}
        >
          Solutions IA Bilingues pour Entreprises Québécoises
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            marginBottom: 40,
            maxWidth: 800,
          }}
        >
          Sites web • SEO • Conformité Loi 25 • Automatisation
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 40,
            color: 'white',
            fontSize: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: 12 }}>✓</div>
            <div>Expertise Bilingue</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: 12 }}>✓</div>
            <div>Technologies IA</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: 12 }}>✓</div>
            <div>Conformité Québec</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}