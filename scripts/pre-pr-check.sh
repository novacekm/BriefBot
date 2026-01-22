#!/bin/bash
#
# Pre-PR Validation Script
# Run this before creating a PR to ensure all CI checks will pass.
#
# Usage: ./scripts/pre-pr-check.sh
#

set -e

echo "============================================"
echo "  BriefBot Pre-PR Validation"
echo "============================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track failures
FAILURES=0

run_check() {
    local name="$1"
    local cmd="$2"

    echo -n "Running $name... "
    if eval "$cmd" > /dev/null 2>&1; then
        echo -e "${GREEN}PASS${NC}"
    else
        echo -e "${RED}FAIL${NC}"
        FAILURES=$((FAILURES + 1))
        echo "  Command: $cmd"
        echo "  Run manually to see errors."
    fi
}

echo "1. Code Quality Checks"
echo "----------------------"
run_check "Lint" "npm run lint"
run_check "Type Check" "npm run type-check"

echo ""
echo "2. Unit Tests"
echo "-------------"
# Note: Unit tests use vitest, but we don't have any unit tests yet
# The CI "Test" job runs Playwright tests, which we cover in E2E below
echo -e "Skipping (no unit tests yet - E2E covers integration)"

echo ""
echo "3. Build"
echo "--------"
run_check "Next.js Build" "npm run build"

echo ""
echo "4. E2E Tests (Chromium only for speed)"
echo "--------------------------------------"
run_check "E2E Tests" "npm run test:e2e -- --project=chromium"

echo ""
echo "5. Visual Regression Tests (Linux baselines - may differ locally)"
echo "-----------------------------------------------------------------"
echo -n "Running Visual Tests... "
if npm run test:visual -- --project=chromium > /dev/null 2>&1; then
    echo -e "${GREEN}PASS${NC}"
else
    echo -e "${YELLOW}WARN${NC} (expected on non-Linux - baselines are Linux-specific)"
    echo "  Visual tests use Linux-generated baselines."
    echo "  They will pass on CI but may fail locally on macOS/Windows."
fi

echo ""
echo "============================================"
if [ $FAILURES -eq 0 ]; then
    echo -e "${GREEN}All checks passed! Safe to create PR.${NC}"
    echo "============================================"
    exit 0
else
    echo -e "${RED}$FAILURES check(s) failed. Fix before creating PR.${NC}"
    echo "============================================"
    exit 1
fi
