#!/usr/bin/env bash
# GEO Review - E-E-A-T 评分脚本
# 提取文章内容和元数据,供 AI 进行 E-E-A-T 评分

# 加载通用函数库
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# 获取文章路径参数
ARTICLE_PATH="$1"

# 检查参数
if [ -z "$ARTICLE_PATH" ]; then
    output_error "缺少文章路径参数"
    exit 1
fi

# 检查文件是否存在
if [ ! -f "$ARTICLE_PATH" ]; then
    output_error "文件不存在: $ARTICLE_PATH"
    exit 1
fi

# 获取绝对路径
ARTICLE_PATH=$(cd "$(dirname "$ARTICLE_PATH")" && pwd)/$(basename "$ARTICLE_PATH")

# ============================================================================
# 提取文章元数据和内容
# ============================================================================

# 提取 frontmatter (YAML)
FRONTMATTER=$(extract_frontmatter "$ARTICLE_PATH")

# 提取文章内容(不包含 frontmatter)
CONTENT=$(extract_content "$ARTICLE_PATH")

# 转义内容为 JSON 字符串
CONTENT_JSON=$(echo "$CONTENT" | jq -Rs .)

# ============================================================================
# 分析文章指标
# ============================================================================

# 1. 字数统计
WORD_COUNT=$(count_words "$ARTICLE_PATH")

# 2. 第一人称计数
FIRST_PERSON_COUNT=$(count_first_person "$ARTICLE_PATH")

# 3. 代码块统计
CODE_BLOCKS=$(count_code_blocks "$ARTICLE_PATH")

# 4. 引用/链接提取
CITATIONS=$(extract_citations "$ARTICLE_PATH")
CITATION_COUNT=$(echo "$CITATIONS" | jq 'length')

# 5. 检测具体细节(数字+单位模式)
SPECIFIC_DETAILS=$(grep -oE '[0-9]+[%天年月日小时分钟秒米厘米个件次]' "$ARTICLE_PATH" 2>/dev/null | wc -l | tr -d ' ')

# 6. 检测数据和统计
DATA_STATS=$(grep -oiE '(调查|研究|数据|统计|报告|显示|表明)[^。]{0,50}[0-9]+%?' "$ARTICLE_PATH" 2>/dev/null | wc -l | tr -d ' ')

# 7. 检测权威引用(机构、专家、论文)
AUTHORITY_REFS=$(grep -oiE '(根据|据|来自|引自|参考)[^。]{0,30}(大学|研究所|协会|学会|机构|专家|博士|教授|论文|期刊)' "$ARTICLE_PATH" 2>/dev/null | wc -l | tr -d ' ')

# 8. 检测作者信息
AUTHOR_INFO=""
if echo "$FRONTMATTER" | grep -q 'author:'; then
    AUTHOR_INFO=$(echo "$FRONTMATTER" | grep 'author:' | sed 's/author:[[:space:]]*//')
fi

# 9. 检测日期
DATE_INFO=""
if echo "$FRONTMATTER" | grep -q 'date:'; then
    DATE_INFO=$(echo "$FRONTMATTER" | grep 'date:' | sed 's/date:[[:space:]]*//')
fi

# 10. 检测更新时间
UPDATED_INFO=""
if echo "$FRONTMATTER" | grep -q 'updated:'; then
    UPDATED_INFO=$(echo "$FRONTMATTER" | grep 'updated:' | sed 's/updated:[[:space:]]*//')
fi

# 11. 检测标签/分类
TAGS=""
if echo "$FRONTMATTER" | grep -q 'tags:'; then
    TAGS=$(echo "$FRONTMATTER" | grep -A 10 'tags:' | grep '^[[:space:]]*-' | sed 's/^[[:space:]]*-[[:space:]]*//' | jq -Rs 'split("\n") | map(select(length > 0))')
else
    TAGS="[]"
fi

# 12. 检测模糊词汇
VAGUE_WORDS=$(grep -oiE '(可能|也许|大概|基本上|一般来说|通常|往往|似乎|好像)' "$ARTICLE_PATH" 2>/dev/null | wc -l | tr -d ' ')

# 13. 检测结构化内容(列表、表格)
LIST_COUNT=$(grep -c '^[[:space:]]*[-*+] ' "$ARTICLE_PATH" 2>/dev/null || echo "0")
TABLE_COUNT=$(grep -c '^|' "$ARTICLE_PATH" 2>/dev/null || echo "0")

# ============================================================================
# 输出结构化 JSON
# ============================================================================

output_json "{
  \"status\": \"success\",
  \"action\": \"analyze\",
  \"article_path\": \"$ARTICLE_PATH\",
  \"article_name\": \"$(basename "$ARTICLE_PATH")\",
  \"timestamp\": \"$(get_timestamp)\",
  \"metrics\": {
    \"word_count\": $WORD_COUNT,
    \"first_person_count\": $FIRST_PERSON_COUNT,
    \"code_blocks\": $CODE_BLOCKS,
    \"citations\": $CITATIONS,
    \"citation_count\": $CITATION_COUNT,
    \"specific_details\": $SPECIFIC_DETAILS,
    \"data_stats\": $DATA_STATS,
    \"authority_refs\": $AUTHORITY_REFS,
    \"vague_words\": $VAGUE_WORDS,
    \"list_count\": $LIST_COUNT,
    \"table_count\": $TABLE_COUNT
  },
  \"metadata\": {
    \"author\": \"$AUTHOR_INFO\",
    \"date\": \"$DATE_INFO\",
    \"updated\": \"$UPDATED_INFO\",
    \"tags\": $TAGS
  },
  \"content\": $CONTENT_JSON,
  \"message\": \"文章分析完成,AI 可根据指标进行 E-E-A-T 评分\"
}"
