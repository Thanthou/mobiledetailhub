# 🧪 Experimental Features

Features in this directory are **proof-of-concept** code that may or may not make it to production.

---

## Current Experimental Features

| Feature | Owner | Created | Status | Next Review |
|---------|-------|---------|--------|-------------|
| _(none yet)_ | - | - | - | - |

---

## Guidelines

### When to use `features-experimental/`

- ✅ Exploring new technologies or patterns
- ✅ Proof-of-concept for potential features
- ✅ Research spikes with uncertain outcomes
- ✅ Code quality can be lower (it's a learning exercise)

### When NOT to use `features-experimental/`

- ❌ Feature is decided and will be built → Use `features-wip/` or feature branch
- ❌ Production code that's incomplete → Use `features-wip/`
- ❌ Technical debt cleanup → Just do it in `components/`

---

## Adding an Experimental Feature

1. Create feature directory
2. Add `README.md` with hypothesis and success criteria
3. Experiment freely - code quality is secondary
4. List it in the table above
5. Set a review date (typically 1-3 months)

**Example README template:**

```markdown
# Experiment Name

**Status:** 🧪 Experimental  
**Owner:** @username  
**Started:** YYYY-MM-DD  
**Review Date:** YYYY-MM-DD

## Hypothesis
What are we trying to prove or disprove?

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Outcomes
(Fill in at review date)

### If Successful:
- Promote to `features-wip/` and rebuild properly
- Or integrate directly if simple enough

### If Unsuccessful:
- Delete and document learnings
```

---

## Review Process

At each review date, decide:

1. **✅ Promote to WIP:** Successful, worth building properly
2. **🔄 Continue Experiment:** Need more research
3. **❌ Archive & Delete:** Not viable or not worth it

---

## Review Schedule

- **Quarterly:** Review all experimental features
- **Annually:** Clean up anything > 1 year old

---

## Expectations

- ❌ **Not production-ready:** Code can be messy
- ❌ **Not maintained:** May break as dependencies change
- ❌ **Not tested:** Tests optional
- ✅ **Document learnings:** Even failed experiments teach us

---

See: [Feature Maturity System](../../../../docs/devtools/FEATURE_MATURITY_SYSTEM.md)

