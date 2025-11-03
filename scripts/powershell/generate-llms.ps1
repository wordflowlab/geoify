# GEO Generate LLMs - llms.txt 生成脚本 (PowerShell)
# 扫描文章目录,提取元数据,供 AI 生成 llms.txt 和 llms-full.txt

# 加载通用函数库
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $ScriptDir "common.ps1")

# ============================================================================
# 参数解析
# ============================================================================

$ArticlesDir = "articles"
$OutputDir = "public"
$MinScore = 7.0
$MaxArticles = 100

# 解析命令行参数
for ($i = 0; $i -lt $args.Count; $i++) {
    switch ($args[$i]) {
        "--articles" {
            $ArticlesDir = $args[$i + 1]
            $i++
        }
        "--output" {
            $OutputDir = $args[$i + 1]
            $i++
        }
        "--min-score" {
            $MinScore = [double]$args[$i + 1]
            $i++
        }
        "--max-articles" {
            $MaxArticles = [int]$args[$i + 1]
            $i++
        }
    }
}

# 检查文章目录是否存在
if (-not (Test-Path $ArticlesDir)) {
    Output-Error "文章目录不存在: $ArticlesDir"
    exit 1
}

# 确保输出目录存在
Ensure-Directory $OutputDir

# ============================================================================
# 扫描文章
# ============================================================================

# 查找所有 Markdown 文件
$articleFiles = Get-ChildItem -Path $ArticlesDir -Filter "*.md" -Recurse -File

if ($articleFiles.Count -eq 0) {
    Output-Error "未找到任何 Markdown 文件"
    exit 1
}

# 构建文章列表
$articles = @()

foreach ($articleFile in $articleFiles) {
    # 提取元数据
    $frontmatter = Extract-Frontmatter $articleFile.FullName

    # 提取标题
    $title = ""
    if ($frontmatter -match 'title:\s*(.+)') {
        $title = $matches[1].Trim() -replace '"', ''
    }

    # 提取描述
    $description = ""
    if ($frontmatter -match 'description:\s*(.+)') {
        $description = $matches[1].Trim() -replace '"', ''
    }

    # 提取标签
    $tags = @()
    if ($frontmatter -match 'tags:\s*\n((?:\s*-\s*.+\n)+)') {
        $tagsText = $matches[1]
        $tags = [regex]::Matches($tagsText, '-\s*(.+)') | ForEach-Object { $_.Groups[1].Value.Trim() }
    }

    # 提取 EEAT 分数
    $eeatScore = ""
    if ($frontmatter -match 'eeat_score:\s*(.+)') {
        $eeatScore = $matches[1].Trim()
    }

    # 提取日期
    $date = ""
    if ($frontmatter -match 'date:\s*(.+)') {
        $date = $matches[1].Trim() -replace '"', ''
    }

    # 提取更新时间
    $updated = ""
    if ($frontmatter -match 'updated:\s*(.+)') {
        $updated = $matches[1].Trim() -replace '"', ''
    }

    # 统计字数
    $wordCount = Count-Words $articleFile.FullName

    # 提取内容
    $content = Extract-Content $articleFile.FullName

    # 获取相对路径
    $relPath = $articleFile.FullName.Replace((Resolve-Path $ArticlesDir).Path + "\", "")

    # 添加到数组
    $articles += @{
        path = $articleFile.FullName
        rel_path = $relPath
        title = $title
        description = $description
        tags = $tags
        eeat_score = $eeatScore
        date = $date
        updated = $updated
        word_count = $wordCount
        content = $content
    }
}

# 统计文章数量
$articleCount = $articles.Count

# ============================================================================
# 输出结构化 JSON
# ============================================================================

$result = @{
    status = "success"
    action = "scan"
    timestamp = Get-Timestamp
    config = @{
        articles_dir = $ArticlesDir
        output_dir = $OutputDir
        min_score = $MinScore
        max_articles = $MaxArticles
    }
    stats = @{
        total_articles = $articleCount
        scanned_at = Get-Timestamp
    }
    articles = $articles
    message = "文章扫描完成,AI 可根据配置生成 llms.txt 和 llms-full.txt"
}

Output-Json ($result | ConvertTo-Json -Depth 10 -Compress)
