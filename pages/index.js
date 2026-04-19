import { useState } from 'react'

export default function Home() {
  const [product, setProduct] = useState('')
  const [keywords, setKeywords] = useState('')
  const [type, setType] = useState('种草')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const generate = async () => {
    if (!product || !keywords) {
      alert('请填写产品名称和关键词')
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, keywords, type })
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      alert('生成失败，请重试')
    }
    setLoading(false)
  }

  const copy = (text) => {
    navigator.clipboard.writeText(text)
    alert('已复制到剪贴板！')
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>📝 小红书文案生成器</h1>
        <p style={styles.subtitle}>AI 一键生成爆款笔记</p>
      </header>

      <div style={styles.card}>
        <div style={styles.formGroup}>
          <label style={styles.label}>产品/主题名称</label>
          <input
            style={styles.input}
            placeholder="比如：夏日防晒霜"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>关键词（3-5个）</label>
          <input
            style={styles.input}
            placeholder="比如：美白、不油腻、学生党"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>笔记类型</label>
          <select style={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="种草">🌱 种草笔记</option>
            <option value="干货">📚 干货分享</option>
            <option value="探店">🏪 探店打卡</option>
            <option value="日常">💭 日常记录</option>
          </select>
        </div>

        <button style={styles.button} onClick={generate} disabled={loading}>
          {loading ? '⏳ 生成中...' : '✨ 生成文案'}
        </button>
      </div>

      {result && (
        <div style={styles.resultCard}>
          <h3 style={styles.resultTitle}>生成结果</h3>
          
          <div style={styles.section}>
            <label style={styles.sectionLabel}>标题（3个备选）</label>
            {result.titles.map((title, i) => (
              <div key={i} style={styles.titleItem}>
                <span>{i + 1}. {title}</span>
                <button style={styles.copyBtn} onClick={() => copy(title)}>复制</button>
              </div>
            ))}
          </div>

          <div style={styles.section}>
            <label style={styles.sectionLabel}>正文</label>
            <div style={styles.contentBox}>
              <pre style={styles.content}>{result.content}</pre>
            </div>
            <button style={styles.copyBtn2} onClick={() => copy(result.content)}>复制正文</button>
          </div>

          <div style={styles.section}>
            <label style={styles.sectionLabel}>推荐标签</label>
            <div style={styles.tags}>{result.tags}</div>
            <button style={styles.copyBtn2} onClick={() => copy(result.tags)}>复制标签</button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    color: 'white',
    padding: '30px 0',
  },
  title: {
    fontSize: '28px',
    margin: '0 0 10px 0',
  },
  subtitle: {
    opacity: 0.9,
    margin: 0,
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 600,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    background: 'white',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  resultCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    marginTop: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  resultTitle: {
    margin: '0 0 20px 0',
    color: '#333',
  },
  section: {
    marginBottom: '20px',
  },
  sectionLabel: {
    display: 'block',
    fontWeight: 600,
    color: '#667eea',
    marginBottom: '10px',
  },
  titleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    background: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '8px',
  },
  copyBtn: {
    padding: '6px 12px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  contentBox: {
    background: '#f5f5f5',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  content: {
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    fontFamily: 'inherit',
    lineHeight: 1.6,
  },
  copyBtn2: {
    padding: '8px 16px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  tags: {
    background: '#f5f5f5',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px',
    color: '#666',
  },
}
