# GEO Schema - Schema.org 生成脚本 (PowerShell)
# 提取文章内容和元数据,供 AI 生成 Schema.org 结构化数据

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
# 提取 Schema.org 所需元数据
# ============================================================================

# 标题
$title = ""
if ($frontmatter -match 'title:\s*(.+)') {
    $title = $matches[1].Trim() -replace '"', ''
} elseif ($content -match '^#\s+(.+)') {
    $title = $matches[1].Trim()
}

# 描述
$description = ""
if ($frontmatter -match 'description:\s*(.+)') {
    $description = $matches[1].Trim() -replace '"', ''
}

# 作者
$author = ""
if ($frontmatter -match 'author:\s*(.+)') {
    $author = $matches[1].Trim() -replace '"', ''
}

# 日期
$date = ""
if ($frontmatter -match 'date:\s*(.+)') {
    $date = $matches[1].Trim() -replace '"', ''
}

# 更新时间
$updated = ""
if ($frontmatter -match 'updated:\s*(.+)') {
    $updated = $matches[1].Trim() -replace '"', ''
}

# 标签
$tags = @()
if ($frontmatter -match 'tags:\s*\n((?:\s*-\s*.+\n)+)') {
    $tagsText = $matches[1]
    $tags = [regex]::Matches($tagsText, '-\s*(.+)') | ForEach-Object { $_.Groups[1].Value.Trim() }
}

# 图片
$image = ""
if ($frontmatter -match 'image:\s*(.+)') {
    $image = $matches[1].Trim() -replace '"', ''
}

# ============================================================================
# 检测内容类型
# ============================================================================

$contentType = "Article"

# 检测是否为 HowTo
if ($content -match '(如何|怎么|教程|步骤|指南)') {
    if ($content -match '^##\s+(步骤|Step)\s+[0-9]+') {
        $contentType = "HowTo"
    }
}

# 检测是否为 FAQ
if ($content -match '^##\s+(Q:|问:|FAQ)') {
    $contentType = "FAQPage"
}

# 检测是否为 Review
if ($content -match '(评测|评价|优缺点|优点|缺点|推荐指数)') {
    $contentType = "Review"
}

# 检测是否为 Person
if ($content -match '(个人简介|关于我|作者介绍)') {
    $contentType = "Person"
}

# ============================================================================
# 提取结构化内容
# ============================================================================

# 提取步骤(HowTo)
$steps = @()
if ($contentType -eq "HowTo") {
    $stepMatches = [regex]::Matches($content, '^##\s+(步骤|Step)\s+[0-9]+.+', [System.Text.RegularExpressions.RegexOptions]::Multiline)
    $steps = $stepMatches | ForEach-Object { $_.Value }
}

# 提取 FAQ 问答
$faqItems = @()
if ($contentType -eq "FAQPage") {
    $faqMatches = [regex]::Matches($content, '^##\s+(Q:|问:).+', [System.Text.RegularExpressions.RegexOptions]::Multiline)
    $faqItems = $faqMatches | ForEach-Object { $_.Value }
}

# ============================================================================
# 分析指标
# ============================================================================

$wordCount = Count-Words $ArticlePath
$codeBlocks = Count-CodeBlocks $ArticlePath
$citations = Extract-Citations $ArticlePath

# ============================================================================
# 输出结构化 JSON
# ============================================================================

$result = @{
    status = "success"
    action = "analyze"
    article_path = $ArticlePath.Path
    article_name = (Split-Path $ArticlePath -Leaf)
    timestamp = Get-Timestamp
    content_type = $contentType
    metadata = @{
        title = $title
        description = $description
        author = $author
        date = $date
        updated = $updated
        tags = $tags
        image = $image
    }
    structure = @{
        steps = $steps
        faq_items = $faqItems
    }
    metrics = @{
        word_count = $wordCount
        code_blocks = $codeBlocks
        citations = $citations
    }
    content = $content
    message = "文章分析完成,AI 可根据类型生成对应的 Schema.org 标记"
}

Output-Json ($result | ConvertTo-Json -Depth 10 -Compress)
