import { ImageResponse } from 'next/og'

export const alt = 'Civil Aviation Mock Exam - PPL, CPL, ATPL Preparation'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(to bottom right, #1e40af, #0ea5e9)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>✈️</div>
        <div style={{ fontWeight: 'bold', marginBottom: 10 }}>Civil Aviation Mock Exam</div>
        <div style={{ fontSize: 40, opacity: 0.9 }}>PPL • CPL • ATPL Preparation</div>
      </div>
    ),
    {
      ...size,
    }
  )
}

