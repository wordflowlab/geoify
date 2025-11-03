#!/usr/bin/env bash
# Geoify Common Functions Library
# 通用函数库,提供所有 bash 脚本使用的工具函数

set -e

# ============================================================================
# 项目路径相关
# ============================================================================

# 查找项目根目录(通过 .geoify/config.json 标识)
get_project_root() {
    local dir="$PWD"
    while [ "$dir" != "/" ]; do
        if [ -f "$dir/.geoify/config.json" ]; then
            echo "$dir"
            return 0
        fi
        dir=$(dirname "$dir")
    done

    # 如果当前目录有 .geoify,也认为是项目根目录
    if [ -d "$PWD/.geoify" ]; then
        echo "$PWD"
        return 0
    fi

    # 没找到,返回当前目录
    echo "$PWD"
    return 1
}

# 获取当前项目目录
get_current_project() {
    local root
    root=$(get_project_root)
    echo "$root"
}

# 获取项目名称(从 .geoify/config.json)
get_project_name() {
    local root
    root=$(get_project_root)
    local config_file="$root/.geoify/config.json"

    if [ -f "$config_file" ]; then
        # 提取 name 字段
        grep -o '"name"[[:space:]]*:[[:space:]]*"[^"]*"' "$config_file" | \
            sed 's/"name"[[:space:]]*:[[:space:]]*"\([^"]*\)"/\1/'
    else
        basename "$root"
    fi
}

# ============================================================================
# JSON 输出相关
# ============================================================================

# 输出 JSON 格式数据(供 AI 解析)
output_json() {
    local json="$1"
    echo "$json"
}

# 输出错误 JSON
output_error() {
    local message="$1"
    output_json "{
  \"status\": \"error\",
  \"message\": \"$message\"
}"
}

# ============================================================================
# 文件操作相关
# ============================================================================

# 检查文件是否存在
check_file_exists() {
    local file_path="$1"
    local file_desc="${2:-文件}"

    if [ ! -f "$file_path" ]; then
        output_error "$file_desc 不存在: $file_path"
        exit 1
    fi

    echo "$file_path"
}

# 确保目录存在
ensure_dir() {
    local dir_path="$1"
    if [ ! -d "$dir_path" ]; then
        mkdir -p "$dir_path"
    fi
}

# ============================================================================
# Markdown 和内容分析相关
# ============================================================================

# 统计字数(中英文混合)
count_words() {
    local file_path="$1"

    if [ ! -f "$file_path" ]; then
        echo "0"
        return
    fi

    # 统计中文字符数 + 英文单词数
    local chinese_chars
    local english_words

    chinese_chars=$(grep -o '[一-龥]' "$file_path" 2>/dev/null | wc -l | tr -d ' ')
    english_words=$(grep -oE '\b[a-zA-Z]+\b' "$file_path" 2>/dev/null | wc -l | tr -d ' ')

    echo $((chinese_chars + english_words))
}

# 提取 Markdown frontmatter (YAML)
extract_frontmatter() {
    local file_path="$1"

    if [ ! -f "$file_path" ]; then
        echo "{}"
        return
    fi

    # 检查是否有 frontmatter
    if ! head -n 1 "$file_path" | grep -q '^---$'; then
        echo "{}"
        return
    fi

    # 提取 --- 之间的内容
    awk '
        BEGIN { in_fm=0; first_line=1 }
        /^---$/ {
            if (first_line) {
                in_fm=1;
                first_line=0;
                next
            } else if (in_fm) {
                exit
            }
        }
        in_fm { print }
    ' "$file_path"
}

# 提取 Markdown 内容(不包含 frontmatter)
extract_content() {
    local file_path="$1"

    if [ ! -f "$file_path" ]; then
        echo ""
        return
    fi

    # 检查是否有 frontmatter
    if ! head -n 1 "$file_path" | grep -q '^---$'; then
        cat "$file_path"
        return
    fi

    # 跳过 frontmatter,输出内容
    awk '
        BEGIN { in_fm=0; first_line=1; fm_ended=0 }
        /^---$/ {
            if (first_line) {
                in_fm=1;
                first_line=0;
                next
            } else if (in_fm) {
                fm_ended=1;
                in_fm=0;
                next
            }
        }
        fm_ended { print }
    ' "$file_path"
}

# 统计代码块数量
count_code_blocks() {
    local file_path="$1"

    if [ ! -f "$file_path" ]; then
        echo "0"
        return
    fi

    # 统计 ``` 的数量并除以2
    local count
    count=$(grep -c '^```' "$file_path" 2>/dev/null || echo "0")
    echo $((count / 2))
}

# 提取引用/链接
extract_citations() {
    local file_path="$1"

    if [ ! -f "$file_path" ]; then
        echo "[]"
        return
    fi

    # 提取 Markdown 链接 [text](url)
    local links
    links=$(grep -oE '\[([^\]]+)\]\(([^)]+)\)' "$file_path" 2>/dev/null | \
            grep -oE '\(([^)]+)\)' | \
            sed 's/[()]//g' | \
            awk 'BEGIN{printf "["} {printf (NR>1?",\"\"":"\"\"")}; {printf "%s",$0}; {printf "\"\""} END{printf "]"}')

    if [ -z "$links" ] || [ "$links" = "[]" ]; then
        echo "[]"
    else
        echo "$links"
    fi
}

# 统计第一人称计数
count_first_person() {
    local file_path="$1"

    if [ ! -f "$file_path" ]; then
        echo "0"
        return
    fi

    # 统计 "我" 的出现次数
    local count
    count=$(grep -o '我' "$file_path" 2>/dev/null | wc -l | tr -d ' ')
    echo "$count"
}

# ============================================================================
# 日期和时间
# ============================================================================

# 获取当前 ISO 8601 时间戳
get_timestamp() {
    date -u +"%Y-%m-%dT%H:%M:%SZ"
}

# ============================================================================
# 脚本调试
# ============================================================================

# 调试输出(输出到 stderr,不影响 JSON)
debug() {
    local message="$1"
    echo "[DEBUG] $message" >&2
}

# 错误输出(输出到 stderr)
error() {
    local message="$1"
    echo "[ERROR] $message" >&2
}

# ============================================================================
# 导出函数(供其他脚本 source 后使用)
# ============================================================================

export -f get_project_root
export -f get_current_project
export -f get_project_name
export -f output_json
export -f output_error
export -f check_file_exists
export -f ensure_dir
export -f count_words
export -f extract_frontmatter
export -f extract_content
export -f count_code_blocks
export -f extract_citations
export -f count_first_person
export -f get_timestamp
export -f debug
export -f error
