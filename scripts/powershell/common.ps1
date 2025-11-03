# Geoify Common Functions Library (PowerShell)
# 通用函数库,提供所有 PowerShell 脚本使用的工具函数

# ============================================================================
# 项目路径相关
# ============================================================================

function Get-ProjectRoot {
    $dir = Get-Location
    while ($dir.Path -ne $dir.Root.Path) {
        if (Test-Path (Join-Path $dir.Path ".geoify\config.json")) {
            return $dir.Path
        }
        $dir = $dir.Parent
    }

    # 如果当前目录有 .geoify,也认为是项目根目录
    if (Test-Path ".geoify") {
        return (Get-Location).Path
    }

    # 没找到,返回当前目录
    return (Get-Location).Path
}

function Get-CurrentProject {
    return Get-ProjectRoot
}

function Get-ProjectName {
    $root = Get-ProjectRoot
    $configFile = Join-Path $root ".geoify\config.json"

    if (Test-Path $configFile) {
        $config = Get-Content $configFile | ConvertFrom-Json
        return $config.name
    }

    return Split-Path $root -Leaf
}

# ============================================================================
# JSON 输出相关
# ============================================================================

function Output-Json {
    param([string]$Json)
    Write-Output $Json
}

function Output-Error {
    param([string]$Message)
    $errorJson = @{
        status = "error"
        message = $Message
    } | ConvertTo-Json -Compress
    Output-Json $errorJson
}

# ============================================================================
# 文件操作相关
# ============================================================================

function Test-FileExists {
    param(
        [string]$FilePath,
        [string]$FileDesc = "文件"
    )

    if (-not (Test-Path $FilePath)) {
        Output-Error "$FileDesc 不存在: $FilePath"
        exit 1
    }

    return $FilePath
}

function Ensure-Directory {
    param([string]$DirPath)

    if (-not (Test-Path $DirPath)) {
        New-Item -ItemType Directory -Path $DirPath -Force | Out-Null
    }
}

# ============================================================================
# Markdown 和内容分析相关
# ============================================================================

function Count-Words {
    param([string]$FilePath)

    if (-not (Test-Path $FilePath)) {
        return 0
    }

    $content = Get-Content $FilePath -Raw

    # 统计中文字符
    $chineseChars = ([regex]::Matches($content, '[\u4e00-\u9fa5]')).Count

    # 统计英文单词
    $englishWords = ([regex]::Matches($content, '\b[a-zA-Z]+\b')).Count

    return $chineseChars + $englishWords
}

function Extract-Frontmatter {
    param([string]$FilePath)

    if (-not (Test-Path $FilePath)) {
        return @{}
    }

    $lines = Get-Content $FilePath

    # 检查是否有 frontmatter
    if ($lines[0] -ne '---') {
        return @{}
    }

    $frontmatterLines = @()
    $inFrontmatter = $false

    for ($i = 1; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -eq '---') {
            break
        }
        $frontmatterLines += $lines[$i]
    }

    return $frontmatterLines -join "`n"
}

function Extract-Content {
    param([string]$FilePath)

    if (-not (Test-Path $FilePath)) {
        return ""
    }

    $lines = Get-Content $FilePath

    # 检查是否有 frontmatter
    if ($lines[0] -ne '---') {
        return $lines -join "`n"
    }

    $contentLines = @()
    $skipFrontmatter = $true
    $frontmatterEnded = $false

    for ($i = 1; $i -lt $lines.Count; $i++) {
        if ($skipFrontmatter -and $lines[$i] -eq '---') {
            $skipFrontmatter = $false
            $frontmatterEnded = $true
            continue
        }

        if ($frontmatterEnded) {
            $contentLines += $lines[$i]
        }
    }

    return $contentLines -join "`n"
}

function Count-CodeBlocks {
    param([string]$FilePath)

    if (-not (Test-Path $FilePath)) {
        return 0
    }

    $content = Get-Content $FilePath -Raw
    $matches = [regex]::Matches($content, '^```', [System.Text.RegularExpressions.RegexOptions]::Multiline)

    return [math]::Floor($matches.Count / 2)
}

function Extract-Citations {
    param([string]$FilePath)

    if (-not (Test-Path $FilePath)) {
        return @()
    }

    $content = Get-Content $FilePath -Raw

    # 提取 Markdown 链接 [text](url)
    $matches = [regex]::Matches($content, '\[([^\]]+)\]\(([^)]+)\)')

    $citations = @()
    foreach ($match in $matches) {
        $citations += $match.Groups[2].Value
    }

    return $citations
}

function Count-FirstPerson {
    param([string]$FilePath)

    if (-not (Test-Path $FilePath)) {
        return 0
    }

    $content = Get-Content $FilePath -Raw
    $matches = [regex]::Matches($content, '我')

    return $matches.Count
}

# ============================================================================
# 日期和时间
# ============================================================================

function Get-Timestamp {
    return (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
}

# ============================================================================
# 脚本调试
# ============================================================================

function Write-Debug {
    param([string]$Message)
    Write-Host "[DEBUG] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# ============================================================================
# 导出函数
# ============================================================================

Export-ModuleMember -Function *
