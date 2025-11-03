#!/usr/bin/env bash
# GEO Schema - Schema.org 生成脚本
# 提取文章内容和元数据,供 AI 生成 Schema.org 结构化数据

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
# 提取 Schema.org 所需元数据
# ============================================================================

# 标题
TITLE=""
if echo "$FRONTMATTER" | grep -q 'title:'; then
    TITLE=$(echo "$FRONTMATTER" | grep 'title:' | sed 's/title:[[:space:]]*//' | tr -d '"')
elif echo "$CONTENT" | head -n 20 | grep -q '^# '; then
    TITLE=$(echo "$CONTENT" | head -n 20 | grep '^# ' | head -n 1 | sed 's/^# //')
fi

# 描述
DESCRIPTION=""
if echo "$FRONTMATTER" | grep -q 'description:'; then
    DESCRIPTION=$(echo "$FRONTMATTER" | grep 'description:' | sed 's/description:[[:space:]]*//' | tr -d '"')
fi

# 作者
AUTHOR=""
if echo "$FRONTMATTER" | grep -q 'author:'; then
    AUTHOR=$(echo "$FRONTMATTER" | grep 'author:' | sed 's/author:[[:space:]]*//' | tr -d '"')
fi

# 日期
DATE=""
if echo "$FRONTMATTER" | grep -q 'date:'; then
    DATE=$(echo "$FRONTMATTER" | grep 'date:' | sed 's/date:[[:space:]]*//' | tr -d '"')
fi

# 更新时间
UPDATED=""
if echo "$FRONTMATTER" | grep -q 'updated:'; then
    UPDATED=$(echo "$FRONTMATTER" | grep 'updated:' | sed 's/updated:[[:space:]]*//' | tr -d '"')
fi

# 标签
TAGS=""
if echo "$FRONTMATTER" | grep -q 'tags:'; then
    TAGS=$(echo "$FRONTMATTER" | grep -A 10 'tags:' | grep '^[[:space:]]*-' | sed 's/^[[:space:]]*-[[:space:]]*//' | jq -Rs 'split("\n") | map(select(length > 0))')
else
    TAGS="[]"
fi

# 图片
IMAGE=""
if echo "$FRONTMATTER" | grep -q 'image:'; then
    IMAGE=$(echo "$FRONTMATTER" | grep 'image:' | sed 's/image:[[:space:]]*//' | tr -d '"')
fi

# ============================================================================
# 检测内容类型
# ============================================================================

# 检测是否为 HowTo (教程类)
IS_HOWTO=false
if echo "$CONTENT" | grep -qiE '(如何|怎么|教程|步骤|指南)'; then
    if echo "$CONTENT" | grep -qE '^## (步骤|Step) [0-9]+'; then
        IS_HOWTO=true
    fi
fi

# 检测是否为 FAQ
IS_FAQ=false
if echo "$CONTENT" | grep -qE '^## (Q:|问:|FAQ)'; then
    IS_FAQ=true
fi

# 检测是否为 Review (评测)
IS_REVIEW=false
if echo "$CONTENT" | grep -qiE '(评测|评价|优缺点|优点|缺点|推荐指数)'; then
    IS_REVIEW=true
fi

# 检测是否为 Person (人物介绍)
IS_PERSON=false
if echo "$CONTENT" | grep -qiE '(个人简介|关于我|作者介绍)'; then
    IS_PERSON=true
fi

# 默认为 Article
CONTENT_TYPE="Article"
if [ "$IS_HOWTO" = true ]; then
    CONTENT_TYPE="HowTo"
elif [ "$IS_FAQ" = true ]; then
    CONTENT_TYPE="FAQPage"
elif [ "$IS_REVIEW" = true ]; then
    CONTENT_TYPE="Review"
elif [ "$IS_PERSON" = true ]; then
    CONTENT_TYPE="Person"
fi

# ============================================================================
# 提取结构化内容
# ============================================================================

# 提取步骤(HowTo)
STEPS="[]"
if [ "$CONTENT_TYPE" = "HowTo" ]; then
    STEPS=$(echo "$CONTENT" | grep -E '^## (步骤|Step) [0-9]+' | jq -Rs 'split("\n") | map(select(length > 0))')
fi

# 提取 FAQ 问答
FAQ_ITEMS="[]"
if [ "$CONTENT_TYPE" = "FAQPage" ]; then
    FAQ_ITEMS=$(echo "$CONTENT" | grep -E '^## (Q:|问:)' | jq -Rs 'split("\n") | map(select(length > 0))')
fi

# ============================================================================
# 分析指标
# ============================================================================

WORD_COUNT=$(count_words "$ARTICLE_PATH")
CODE_BLOCKS=$(count_code_blocks "$ARTICLE_PATH")
CITATIONS=$(extract_citations "$ARTICLE_PATH")

# ============================================================================
# 输出结构化 JSON
# ============================================================================

output_json "{
  \"status\": \"success\",
  \"action\": \"analyze\",
  \"article_path\": \"$ARTICLE_PATH\",
  \"article_name\": \"$(basename "$ARTICLE_PATH")\",
  \"timestamp\": \"$(get_timestamp)\",
  \"content_type\": \"$CONTENT_TYPE\",
  \"metadata\": {
    \"title\": \"$TITLE\",
    \"description\": \"$DESCRIPTION\",
    \"author\": \"$AUTHOR\",
    \"date\": \"$DATE\",
    \"updated\": \"$UPDATED\",
    \"tags\": $TAGS,
    \"image\": \"$IMAGE\"
  },
  \"structure\": {
    \"steps\": $STEPS,
    \"faq_items\": $FAQ_ITEMS
  },
  \"metrics\": {
    \"word_count\": $WORD_COUNT,
    \"code_blocks\": $CODE_BLOCKS,
    \"citations\": $CITATIONS
  },
  \"content\": $CONTENT_JSON,
  \"message\": \"文章分析完成,AI 可根据类型生成对应的 Schema.org 标记\"
}"
