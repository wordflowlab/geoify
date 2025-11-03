# GEO Review - E-E-A-T 评分脚本 (PowerShell)
# 提取文章内容和元数据,供 AI 进行 E-E-A-T 评分

# 加载通用函数库
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $ScriptDir "common.ps1")

# 获取文章路径参数
$ArticlePath = $args[0]

# 检查参数
if (-not $ArticlePath) {
    Output-Error "缺少文章路径参数"
    exit 1
}

# 检查文件是否存在
if (-not (Test-Path $ArticlePath)) {
    Output-Error "文件不存在: $ArticlePath"
    exit 1
}

# 获取绝对路径
$ArticlePath = Resolve-Path $ArticlePath

# ============================================================================
# 提取文章元数据和内容
# ============================================================================

$frontmatter = Extract-Frontmatter $ArticlePath
$content = Extract-Content $ArticlePath

# ============================================================================
# 分析文章指标
# ============================================================================

# 1. 字数统计
$wordCount = Count-Words $ArticlePath

# 2. 第一人称计数
$firstPersonCount = Count-FirstPerson $ArticlePath

# 3. 代码块统计
$codeBlocks = Count-CodeBlocks $ArticlePath

# 4. 引用/链接提取
$citations = Extract-Citations $ArticlePath
$citationCount = $citations.Count

# 5. 检测具体细节(数字+单位模式)
$contentText = Get-Content $ArticlePath -Raw
$specificDetailsMatches = [regex]::Matches($contentText, '[0-9]+[%天年月日小时分钟秒米厘米个件次]')
$specificDetails = $specificDetailsMatches.Count

# 6. 检测数据和统计
$dataStatsMatches = [regex]::Matches($contentText, '(调查|研究|数据|统计|报告|显示|表明).{0,50}[0-9]+%?', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$dataStats = $dataStatsMatches.Count

# 7. 检测权威引用
$authorityRefsMatches = [regex]::Matches($contentText, '(根据|据|来自|引自|参考).{0,30}(大学|研究所|协会|学会|机构|专家|博士|教授|论文|期刊)', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$authorityRefs = $authorityRefsMatches.Count

# 8. 提取元数据字段
$authorInfo = ""
$dateInfo = ""
$updatedInfo = ""
$tags = @()

if ($frontmatter -match 'author:\s*(.+)') {
    $authorInfo = $matches[1].Trim()
}

if ($frontmatter -match 'date:\s*(.+)') {
    $dateInfo = $matches[1].Trim()
}

if ($frontmatter -match 'updated:\s*(.+)') {
    $updatedInfo = $matches[1].Trim()
}

# 提取 tags
if ($frontmatter -match 'tags:\s*\n((?:\s*-\s*.+\n)+)') {
    $tagsText = $matches[1]
    $tags = [regex]::Matches($tagsText, '-\s*(.+)') | ForEach-Object { $_.Groups[1].Value.Trim() }
}

# 9. 检测模糊词汇
$vagueWordsMatches = [regex]::Matches($contentText, '(可能|也许|大概|基本上|一般来说|通常|往往|似乎|好像)', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$vagueWords = $vagueWordsMatches.Count

# 10. 检测结构化内容
$listMatches = [regex]::Matches($contentText, '^\s*[-*+]\s', [System.Text.RegularExpressions.RegexOptions]::Multiline)
$listCount = $listMatches.Count

$tableMatches = [regex]::Matches($contentText, '^\|', [System.Text.RegularExpressions.RegexOptions]::Multiline)
$tableCount = $tableMatches.Count

# ============================================================================
# 输出结构化 JSON
# ============================================================================

$result = @{
    status = "success"
    action = "analyze"
    article_path = $ArticlePath.Path
    article_name = (Split-Path $ArticlePath -Leaf)
    timestamp = Get-Timestamp
    metrics = @{
        word_count = $wordCount
        first_person_count = $firstPersonCount
        code_blocks = $codeBlocks
        citations = $citations
        citation_count = $citationCount
        specific_details = $specificDetails
        data_stats = $dataStats
        authority_refs = $authorityRefs
        vague_words = $vagueWords
        list_count = $listCount
        table_count = $tableCount
    }
    metadata = @{
        author = $authorInfo
        date = $dateInfo
        updated = $updatedInfo
        tags = $tags
    }
    content = $content
    message = "文章分析完成,AI 可根据指标进行 E-E-A-T 评分"
}

Output-Json ($result | ConvertTo-Json -Depth 10 -Compress)
