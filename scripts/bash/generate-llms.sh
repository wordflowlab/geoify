#!/usr/bin/env bash
# GEO Generate LLMs - llms.txt 生成脚本
# 扫描文章目录,提取元数据,供 AI 生成 llms.txt 和 llms-full.txt

# 加载通用函数库
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# ============================================================================
# 参数解析
# ============================================================================

ARTICLES_DIR="articles"
OUTPUT_DIR="public"
MIN_SCORE=7.0
MAX_ARTICLES=100

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --articles)
            ARTICLES_DIR="$2"
            shift 2
            ;;
        --output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        --min-score)
            MIN_SCORE="$2"
            shift 2
            ;;
        --max-articles)
            MAX_ARTICLES="$2"
            shift 2
            ;;
        *)
            shift
            ;;
    esac
done

# 检查文章目录是否存在
if [ ! -d "$ARTICLES_DIR" ]; then
    output_error "文章目录不存在: $ARTICLES_DIR"
    exit 1
fi

# 确保输出目录存在
ensure_dir "$OUTPUT_DIR"

# ============================================================================
# 扫描文章
# ============================================================================

# 查找所有 Markdown 文件
ARTICLE_FILES=$(find "$ARTICLES_DIR" -type f -name "*.md" 2>/dev/null)

if [ -z "$ARTICLE_FILES" ]; then
    output_error "未找到任何 Markdown 文件"
    exit 1
fi

# 构建文章列表 JSON
ARTICLES_JSON="["
FIRST=true

for ARTICLE_FILE in $ARTICLE_FILES; do
    # 跳过非文件
    if [ ! -f "$ARTICLE_FILE" ]; then
        continue
    fi

    # 提取元数据
    FRONTMATTER=$(extract_frontmatter "$ARTICLE_FILE")

    # 提取标题
    TITLE=""
    if echo "$FRONTMATTER" | grep -q 'title:'; then
        TITLE=$(echo "$FRONTMATTER" | grep 'title:' | sed 's/title:[[:space:]]*//' | tr -d '"' | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
    fi

    # 提取描述
    DESCRIPTION=""
    if echo "$FRONTMATTER" | grep -q 'description:'; then
        DESCRIPTION=$(echo "$FRONTMATTER" | grep 'description:' | sed 's/description:[[:space:]]*//' | tr -d '"' | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
    fi

    # 提取标签
    TAGS=""
    if echo "$FRONTMATTER" | grep -q 'tags:'; then
        TAGS=$(echo "$FRONTMATTER" | grep -A 10 'tags:' | grep '^[[:space:]]*-' | sed 's/^[[:space:]]*-[[:space:]]*//' | jq -Rs 'split("\n") | map(select(length > 0))')
    else
        TAGS="[]"
    fi

    # 提取 EEAT 分数
    EEAT_SCORE=""
    if echo "$FRONTMATTER" | grep -q 'eeat_score:'; then
        EEAT_SCORE=$(echo "$FRONTMATTER" | grep 'eeat_score:' | sed 's/eeat_score:[[:space:]]*//')
    fi

    # 提取日期
    DATE=""
    if echo "$FRONTMATTER" | grep -q 'date:'; then
        DATE=$(echo "$FRONTMATTER" | grep 'date:' | sed 's/date:[[:space:]]*//' | tr -d '"')
    fi

    # 提取更新时间
    UPDATED=""
    if echo "$FRONTMATTER" | grep -q 'updated:'; then
        UPDATED=$(echo "$FRONTMATTER" | grep 'updated:' | sed 's/updated:[[:space:]]*//' | tr -d '"')
    fi

    # 统计字数
    WORD_COUNT=$(count_words "$ARTICLE_FILE")

    # 提取内容
    CONTENT=$(extract_content "$ARTICLE_FILE")
    CONTENT_JSON=$(echo "$CONTENT" | jq -Rs .)

    # 获取相对路径
    REL_PATH="${ARTICLE_FILE#$ARTICLES_DIR/}"

    # 添加到 JSON 数组
    if [ "$FIRST" = false ]; then
        ARTICLES_JSON="$ARTICLES_JSON,"
    fi
    FIRST=false

    ARTICLES_JSON="$ARTICLES_JSON
    {
      \"path\": \"$ARTICLE_FILE\",
      \"rel_path\": \"$REL_PATH\",
      \"title\": \"$TITLE\",
      \"description\": \"$DESCRIPTION\",
      \"tags\": $TAGS,
      \"eeat_score\": \"$EEAT_SCORE\",
      \"date\": \"$DATE\",
      \"updated\": \"$UPDATED\",
      \"word_count\": $WORD_COUNT,
      \"content\": $CONTENT_JSON
    }"
done

ARTICLES_JSON="$ARTICLES_JSON
]"

# 统计文章数量
ARTICLE_COUNT=$(echo "$ARTICLE_FILES" | wc -l | tr -d ' ')

# ============================================================================
# 输出结构化 JSON
# ============================================================================

output_json "{
  \"status\": \"success\",
  \"action\": \"scan\",
  \"timestamp\": \"$(get_timestamp)\",
  \"config\": {
    \"articles_dir\": \"$ARTICLES_DIR\",
    \"output_dir\": \"$OUTPUT_DIR\",
    \"min_score\": $MIN_SCORE,
    \"max_articles\": $MAX_ARTICLES
  },
  \"stats\": {
    \"total_articles\": $ARTICLE_COUNT,
    \"scanned_at\": \"$(get_timestamp)\"
  },
  \"articles\": $ARTICLES_JSON,
  \"message\": \"文章扫描完成,AI 可根据配置生成 llms.txt 和 llms-full.txt\"
}"
