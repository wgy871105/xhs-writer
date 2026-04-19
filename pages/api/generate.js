export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { product, keywords, type } = req.body

  const prompt = `你是小红书爆款文案专家。请为以下产品生成小红书笔记：

产品：${product}
关键词：${keywords}
笔记类型：${type}

请生成以下内容：
1. 3个吸引人的标题（带 emoji，15-20字）
2. 正文内容（300-500字，口语化，带 emoji，分段清晰）
3. 10个相关标签（带 # 号）

格式要求：
- 标题要抓人眼球，用数字、疑问、惊叹等手法
- 正文开头要有 hook（悬念/痛点/好奇）
- 中间分享真实体验/干货
- 结尾引导互动（提问或征集评论）
- 标签要精准，包含大词和长尾词

请直接输出结果，不要解释。`

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是小红书文案专家，擅长写爆款笔记。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1500
      })
    })

    const data = await response.json()
    const text = data.choices[0].message.content

    // 解析返回的内容
    const titles = extractTitles(text)
    const content = extractContent(text)
    const tags = extractTags(text)

    res.status(200).json({ titles, content, tags })
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: '生成失败' })
  }
}

function extractTitles(text) {
  const lines = text.split('\n').filter(l => l.trim())
  const titles = []
  
  for (const line of lines) {
    const match = line.match(/^(?:\d+[.、]\s*|[-•]\s*)(.+)/)
    if (match && titles.length < 3) {
      titles.push(match[1].trim())
    }
  }
  
  if (titles.length === 0) {
    return lines.slice(0, 3).map(l => l.replace(/^[\d.\s]+/, '').trim())
  }
  
  return titles
}

function extractContent(text) {
  const lines = text.split('\n')
  let content = []
  let started = false
  
  for (const line of lines) {
    if (!started && (line.match(/^\d+[.、]/) || line.includes('标题'))) {
      continue
    }
    started = true
    
    if (line.includes('#') || line.includes('标签')) {
      break
    }
    
    if (line.trim()) {
      content.push(line)
    }
  }
  
  return content.join('\n').trim() || text
}

function extractTags(text) {
  const tagMatch = text.match(/[#＃][\u4e00-\u9fa5\w]+/g)
  if (tagMatch) {
    return tagMatch.slice(0, 10).join(' ')
  }
  
  const keywords = text.match(/[\u4e00-\u9fa5]{2,6}/g)
  if (keywords) {
    return keywords.slice(0, 10).map(k => '#' + k).join(' ')
  }
  
  return '#小红书 #好物推荐'
}
