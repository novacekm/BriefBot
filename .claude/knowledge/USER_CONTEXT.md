# User Context Reference

> Quick reference for understanding BriefBot's target users and their needs.

## Target Market

- **2.5 million** foreign residents in Switzerland (27% of population)
- **83,000+** new immigrants annually
- **78,000+** international students
- No existing solution specifically for Swiss official documents

## Primary User Personas

### 1. Maria - New Expat (Primary)
- Brazilian software engineer, 3 months in Zurich
- B permit holder, high tech comfort
- **Pain**: First tax return, health insurance choices, permit requirements
- **Needs**: Instant understanding, deadline alerts, Swiss context

### 2. Ahmed - Refugee
- Syrian with F permit in Geneva
- Limited French, high anxiety about permit
- **Pain**: Integration requirements, fear of mistakes affecting status
- **Needs**: Simple language, visual cues, reassurance

### 3. Thomas - Long-term Resident
- British, 15 years in Bern, C permit
- Speaks German but struggles with "Amtsdeutsch"
- **Pain**: Bureaucratic German, time wasted decoding letters
- **Needs**: Quick summaries, jargon explanation

### 4. Rosa - Elderly Swiss
- Italian-speaking Swiss in Zurich, 74 years old
- Low tech comfort, overwhelmed by modern complexity
- **Pain**: Scam detection, health insurance changes
- **Needs**: Large text, simple interface, trust indicators

### 5. Luca - Young Adult
- Swiss student, first time managing own bureaucracy
- Very high tech comfort, prefers mobile
- **Pain**: No education on adulting, canton change
- **Needs**: Visual explanations, shareable content

## Core Pain Points (All Users)

| Pain Point | Severity | Opportunity |
|------------|----------|-------------|
| Unknown deadlines | Critical | Deadline extraction |
| Bureaucratic jargon | High | Plain language summaries |
| Fear of mistakes | High | Confidence indicators |
| Action items unclear | High | Action extraction |
| Canton-specific rules | Medium | Canton-aware context |
| Scam vs. real confusion | Medium | Document verification |

## Emotional Journey

```
Letter arrives → Anxiety ("What now?") → Translation attempt →
Confusion → Help-seeking → Delayed action → Relief or Panic
```

## What Users Want

1. **Instant OCR** - Answers now, not in 24 hours
2. **Deadline extraction** - #1 anxiety reducer
3. **Action items** - "What do I need to do?"
4. **Plain language** - "What this means"
5. **Canton-aware** - Rules vary by location
6. **Privacy-first** - Sensitive documents

## Current Alternatives (Pain Points)

| Alternative | Problem |
|-------------|---------|
| Google Translate | No Swiss context, often wrong |
| Professional translation | CHF 30-60/document, 2-5 days |
| Expat forums | Slow, unreliable |
| Friends/colleagues | Privacy concerns, availability |

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to understanding | < 60 seconds |
| User confidence ("I understand") | > 4/5 |
| Deadline identification | > 95% accuracy |
| Return usage (30 days) | > 40% |

## Key Quotes

> "I'm a senior engineer who manages complex systems, but Swiss bureaucracy makes me feel incompetent." - Maria

> "I don't know what I don't know. Each letter might be routine or life-changing." - Ahmed

> "Fifteen years here and I still can't decode an official letter quickly." - Thomas

## Design Implications

- **Mobile-first**: Most users photograph letters immediately
- **Calm UI**: Reduce anxiety, avoid alarming colors
- **Trust signals**: Privacy emphasis, accuracy indicators
- **Education**: Help users learn, not just translate

## For More Details

See `docs/research/USER_PERSONAS.md` for complete persona profiles and journey maps.
