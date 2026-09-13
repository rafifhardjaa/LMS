#!/bin/bash
BASE="http://localhost:3000/api/v1"
TOKEN="<your-admin-token>"
SISWA_TOKEN="<siswa-token>"
MODULE_ID="<module-id>"
SUBJECT_ID="<subject-id>"

echo "=== CREATE LESSON ==="
curl -s -X POST $BASE/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"module_id\":\"$MODULE_ID\",\"title\":\"Test Lesson\",\"order_index\":1}" | jq

echo "=== LIST LESSONS BY MODULE ==="
curl -s -H "Authorization: Bearer $TOKEN" \
  $BASE/lessons/module/$MODULE_ID | jq

echo "=== ENROLL ==="
curl -s -X POST $BASE/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SISWA_TOKEN" \
  -d "{\"subject_id\":\"$SUBJECT_ID\"}" | jq

echo "=== MY COURSES ==="
curl -s -H "Authorization: Bearer $SISWA_TOKEN" \
  $BASE/enrollments/my-courses | jq

echo "=== DONE ==="