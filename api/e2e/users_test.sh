#!/bin/bash

# Basic E2E test for Users API

BASE_URL="http://localhost:3000"
TEMP_FILE=$(mktemp)

echo "🧪 Starting E2E tests for Users API"
echo "=================================="

# Test 1: List users (should be empty)
echo "1. GET /users (initial - should be empty)"
curl -s "$BASE_URL/users" | jq .
echo

# Test 2: Create user
echo "2. POST /users (create user)"
USER_ID=$(curl -s -X POST "$BASE_URL/users" \
 -H "Content-Type: application/json" \
 -d '{"name": "Alice"}' | jq -r '.id')

if [ "$USER_ID" != "null" ]; then
   echo "✅ Created user with ID: $USER_ID"
else
   echo "❌ Failed to create user"
   exit 1
fi
echo

# Test 3: List users (should have 1)
echo "3. GET /users (after create)"
curl -s "$BASE_URL/users" | jq .
echo

# Test 4: Get specific user
echo "4. GET /users/$USER_ID"
curl -s "$BASE_URL/users/$USER_ID" | jq .
echo

# Test 5: Update user
echo "5. PUT /users/$USER_ID (update user)"
curl -s -X PUT "$BASE_URL/users/$USER_ID" \
 -H "Content-Type: application/json" \
 -d '{"name": "Alice Updated"}' | jq .
echo

# Test 6: Get user again (verify update)
echo "6. GET /users/$USER_ID (verify update)"
UPDATED_NAME=$(curl -s "$BASE_URL/users/$USER_ID" | jq -r '.name')
if [ "$UPDATED_NAME" = "Alice Updated" ]; then
   echo "✅ Update successful: $UPDATED_NAME"
else
   echo "❌ Update failed"
fi
echo

# Test 7: Delete user
echo "7. DELETE /users/$USER_ID"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE_URL/users/$USER_ID")
if [ "$HTTP_CODE" = "204" ]; then
   echo "✅ Delete successful (HTTP $HTTP_CODE)"
else
   echo "❌ Delete failed (HTTP $HTTP_CODE)"
fi
echo

# Test 8: List users (should be empty again)
echo "8. GET /users (after delete - should be empty)"
curl -s "$BASE_URL/users" | jq .
echo

# Test 9: Try to get deleted user (should 404)
echo "9. GET /users/$USER_ID (should 404)"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/users/$USER_ID")
if [ "$HTTP_CODE" = "404" ]; then
   echo "✅ User not found (HTTP $HTTP_CODE)"
else
   echo "❌ Expected 404, got HTTP $HTTP_CODE"
fi

echo
echo "🏁 E2E tests completed"

# Cleanup
rm -f "$TEMP_FILE"