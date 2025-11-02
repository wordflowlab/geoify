#!/bin/bash

# Geoify 命令生成脚本
# 将 templates/commands 中的模板转换为各 AI 平台格式

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 默认配置
AGENTS="claude,gemini,cursor"
SCRIPTS="md"

# 解析参数
for arg in "$@"; do
  case $arg in
    --agents=*)
      AGENTS="${arg#*=}"
      shift
      ;;
    --scripts=*)
      SCRIPTS="${arg#*=}"
      shift
      ;;
  esac
done

echo -e "${GREEN}🚀 生成 Geoify 命令...${NC}"
echo "AI 平台: $AGENTS"
echo "脚本格式: $SCRIPTS"
echo ""

# 命令列表
COMMANDS=(
  "geo-analyze"
  "geo-write"
  "geo-review"
  "geo-schema"
  "geo-publish"
  "geo-track"
  "specify"
  "research"
  "collect"
)

# AI 平台配置
# 格式: 平台名:命令目录:命令分隔符
declare -A PLATFORM_CONFIG
PLATFORM_CONFIG[claude]=".claude/commands:."
PLATFORM_CONFIG[gemini]=".gemini/commands::"
PLATFORM_CONFIG[cursor]=".cursor/commands:-"
PLATFORM_CONFIG[windsurf]=".windsurf/commands:-"
PLATFORM_CONFIG[roocode]=".roocode/commands:-"
PLATFORM_CONFIG[copilot]=".github/copilot-instructions:-"
PLATFORM_CONFIG[qwen]=".qwen/commands:-"
PLATFORM_CONFIG[opencode]=".opencode/commands:-"
PLATFORM_CONFIG[codex]=".codex/commands:-"
PLATFORM_CONFIG[kilocode]=".kilocode/commands:-"
PLATFORM_CONFIG[auggie]=".auggie/commands:-"
PLATFORM_CONFIG[codebuddy]=".codebuddy/commands:-"
PLATFORM_CONFIG[q]=".q/commands:-"

# 分割 agents 参数
IFS=',' read -ra AGENT_LIST <<< "$AGENTS"

# 为每个平台生成命令
for agent in "${AGENT_LIST[@]}"; do
  if [[ -z "${PLATFORM_CONFIG[$agent]}" ]]; then
    echo -e "${YELLOW}⚠️  未知平台: $agent${NC}"
    continue
  fi

  # 解析平台配置
  IFS=':' read -r COMMANDS_DIR SEPARATOR <<< "${PLATFORM_CONFIG[$agent]}"

  echo -e "${GREEN}📝 生成 $agent 命令...${NC}"

  # 创建命令目录
  mkdir -p "$COMMANDS_DIR"

  # 复制每个命令模板
  for cmd in "${COMMANDS[@]}"; do
    TEMPLATE_FILE="templates/commands/${cmd}.md"

    if [[ ! -f "$TEMPLATE_FILE" ]]; then
      echo -e "${YELLOW}⚠️  模板不存在: $TEMPLATE_FILE${NC}"
      continue
    fi

    # 根据平台调整命令名
    if [[ "$agent" == "claude" ]]; then
      # Claude: geo.analyze
      CMD_NAME="${cmd//-/.}"
    elif [[ "$agent" == "gemini" ]]; then
      # Gemini: geo:analyze
      CMD_NAME="${cmd//-/:}"
    else
      # 其他: geo-analyze
      CMD_NAME="$cmd"
    fi

    OUTPUT_FILE="${COMMANDS_DIR}/${CMD_NAME}.md"

    # 复制模板
    cp "$TEMPLATE_FILE" "$OUTPUT_FILE"

    echo "  ✓ $OUTPUT_FILE"
  done

  # 生成平台 README
  README_FILE="${COMMANDS_DIR}/README.md"

  cat > "$README_FILE" << EOF
# ${agent^} 命令

## Geoify GEO 优化工作流

### 核心命令

EOF

  # 添加命令列表
  for cmd in "${COMMANDS[@]}"; do
    if [[ "$agent" == "claude" ]]; then
      CMD_NAME="${cmd//-/.}"
    elif [[ "$agent" == "gemini" ]]; then
      CMD_NAME="${cmd//-/:}"
    else
      CMD_NAME="$cmd"
    fi

    # 从模板中提取描述
    DESCRIPTION=$(grep "^description:" "templates/commands/${cmd}.md" | sed 's/description: //')

    echo "- \`/${CMD_NAME}\` - ${DESCRIPTION}" >> "$README_FILE"
  done

  cat >> "$README_FILE" << EOF

## 使用流程

1. \`/geo-analyze\` → 分析目标话题的 GEO 现状
2. \`/specify\` → 定义内容目标和 E-E-A-T 要求
3. \`/research\` → 研究竞争对手和权威来源
4. \`/collect\` → 收集真实数据和案例
5. \`/geo-write\` → 生成符合 E-E-A-T 标准的内容
6. \`/geo-review\` → GEO 专项审校
7. \`/geo-schema\` → 生成结构化数据标记
8. \`/geo-publish\` → 发布并提交到 AI 索引
9. \`/geo-track\` → 跟踪 AI 引用情况

## E-E-A-T 原则

- **Experience (体验)**: 内容基于真实经历
- **Expertise (专业性)**: 展示专业知识
- **Authoritativeness (权威性)**: 引用权威来源
- **Trustworthiness (可信度)**: 数据可验证

## 了解更多

- [Geoify 文档](https://github.com/wordflowlab/geoify)
- [GEO 优化指南](https://github.com/wordflowlab/geoify/docs)
EOF

  echo "  ✓ $README_FILE"
  echo ""
done

echo -e "${GREEN}✅ 命令生成完成!${NC}"
echo ""
echo "生成的平台数: ${#AGENT_LIST[@]}"
echo "每个平台命令数: ${#COMMANDS[@]}"
