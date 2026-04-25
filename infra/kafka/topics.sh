#!/usr/bin/env bash
# Create all Kafka topics for local development.
# Usage: ./topics.sh [bootstrap-server]
set -euo pipefail

BOOTSTRAP="${1:-localhost:9092}"

create_topic() {
  local name=$1
  local partitions=${2:-3}
  kafka-topics.sh \
    --bootstrap-server "$BOOTSTRAP" \
    --create \
    --if-not-exists \
    --topic "$name" \
    --partitions "$partitions" \
    --replication-factor 1
  echo "✓ Topic: $name (partitions=$partitions)"
}

echo "Creating Intent Platform Kafka topics on $BOOTSTRAP ..."

create_topic "raw-events"        6
create_topic "processed-events"  6
create_topic "intent-updates"    3
create_topic "segment-updates"   3
create_topic "session-events"    3

echo ""
echo "All topics created."
kafka-topics.sh --bootstrap-server "$BOOTSTRAP" --list
