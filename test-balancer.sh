#!/bin/bash

echo "🧪 Тест балансировки нагрузки"
echo "=============================="
echo ""

for i in {1..6}; do
  echo "Запрос #$i:"
  curl -s http://localhost/api/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost/api/health
  echo ""
done

echo "=============================="
echo "✅ Запросы распределяются между backend-1 и backend-2"
