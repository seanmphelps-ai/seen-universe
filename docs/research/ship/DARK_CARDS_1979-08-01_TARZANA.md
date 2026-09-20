# Dark cards — 1979-08-01 · Tarzana, CA

## Calc provenance

- Subject: 1979-08-01, Tarzana CA; coordinates used: **34.173 N, 118.553 W** (engine longitude input: `-118.553`).
- Unknown birth time was tested as the three locked dark-window scenarios: `04:00`, `12:00`, `20:00` America/Los_Angeles. These are scenarios, not a claimed exact birth time.
- Ran the existing **seen-universe** Next route: `POST /api/seen/chart-engine/` with `mode: "dark-windows"`.
- **Calculation is real:** Swiss Ephemeris WASM, `SEFLG_SWIEPH`, with `tz-lookup` + Luxon historical timezone conversion. The API returned three charts.
- Scenario anchors from the live output: night Ascendant Cancer 11.59°; day Libra 22.02°; evening Aquarius 11.97°. The Sun, Moon, and outer placements are nearly stable; houses/angles move substantially.
- Existing 64-portal layer also ran. Top returned expressions were `sensitized`; portals are never marked inactive.
- GeoPresence ran, but with no lived-history text it stayed at its label-only heuristic baseline. It did **not** invent poverty or violence exposure.

---

# NIGHT

**Reveal**  This person looks for the hidden motive before they trust the visible one. They can be warm, proud, and intensely loyal, but closeness also feels like a place where they can be watched, judged, or left.

**Pressure**  Feeling ignored, exposed, or emotionally cornered. A small change in tone becomes evidence that the bond is unsafe.

**Pressure point**  Unanswered messages, mixed signals, public embarrassment, or a partner asking for proof of love.

**Behavior**  They coil first, then strike sideways: a sharp question, a remembered detail, a test disguised as concern. If that fails, they go quiet and make the other person guess what they did wrong.

**Consequence**  The partner is pulled into defending themselves against a case that was built in private. The person gets temporary control, but loses the simple contact they wanted.

**Collapse**  They rewrite the whole relationship around one wound and call withdrawal self-protection.

**Thrive**  In a real crisis, this pattern can read the room fast and protect what is vulnerable—if they say what they know instead of making love pass a secret exam.

**Release**  Name the fear before collecting evidence: “I felt shut out.” Ask one direct question, then stop investigating.

**Attachment memo**
- **How they attach:** Through loyalty, private disclosure, and the feeling that two people share a world no one else can enter.
- **How they sabotage love:** They turn uncertainty into a test and silence into a verdict.
- **What love falls victim to:** Suspicion wearing the clothes of devotion.
- **Cost to them:** Restlessness, shame after the blow-up, and the loneliness of being “right” alone.
- **Cost to the other person:** Walking on eggshells and explaining ordinary behavior as if it were a betrayal.
- **What is lost if it runs one more cycle:** The chance to be loved without performing innocence.
- **Wound / injury / darkness underneath:** Being unseen; learning that need is dangerous; fearing that if they relax, someone else gets the power.

---

# DAY

**Reveal**  This person wants to be unmistakably valued. They can bring heat, charm, and a strong public presence, but rejection lands as an attack on their worth—not merely a disagreement.

**Pressure**  Criticism, being overlooked, or being asked to shrink while someone else takes the room.

**Pressure point**  A partner correcting them in front of others, withholding praise, or making them feel replaceable.

**Behavior**  They perform competence, argue the wording, and keep talking until the other person either agrees or gives up. When the argument touches shame, the warmth flips into contempt or a polished disappearance.

**Consequence**  The original problem gets buried under the fight to be recognized. The partner feels managed rather than met.

**Collapse**  They confuse being loved with being affirmed, then punish the relationship for failing to provide constant proof.

**Thrive**  Their force can rally people and make a neglected problem visible—when recognition is shared instead of demanded.

**Release**  Separate the need from the performance: ask for reassurance plainly, accept one useful correction, and leave the room with dignity intact.

**Attachment memo**
- **How they attach:** Through admiration, visible loyalty, and a partner who celebrates their full presence.
- **How they sabotage love:** They make every disagreement a referendum on respect.
- **What love falls victim to:** The hunger to win the room before tending the bond.
- **Cost to them:** Exhaustion, defensiveness, and the fear that quiet means they no longer matter.
- **Cost to the other person:** Being cast as an audience, critic, or rival instead of a lover.
- **What is lost if it runs one more cycle:** Tenderness that does not need applause.
- **Wound / injury / darkness underneath:** Not feeling chosen; learning to earn safety through display; fearing there is nothing lovable behind the role.

---

# EVENING

**Reveal**  This person keeps a cool distance until someone reaches the protected core. Then the response can be sudden: intense pursuit, an abrupt exit, or a clean break that leaves no room for negotiation.

**Pressure**  Dependence, emotional demands, or the sense that a relationship is taking over their freedom.

**Pressure point**  A partner asking “Where is this going?”, making plans for them, or pressing for an answer before they have privately decided.

**Behavior**  They intellectualize, detach, or make a joke while pressure builds. Then they cut the wire, send the long message, or disappear and call the rupture clarity.

**Consequence**  The partner experiences the ending as both sudden and prewritten. The person gets relief from pressure but carries the unfinished attachment forward.

**Collapse**  They mistake numbness for independence and make distance prove that nobody can hold them.

**Thrive**  Their refusal to obey a dead script can free a relationship from control—if they negotiate change before detonating the bond.

**Release**  State the boundary while still connected: “I need room, not an ending.” Offer a time to return to the conversation and keep it.

**Attachment memo**
- **How they attach:** Through friendship, shared ideas, humor, and a feeling of chosen freedom.
- **How they sabotage love:** They wait until the pressure is unbearable, then use finality to regain breathing room.
- **What love falls victim to:** The belief that needing someone means losing the self.
- **Cost to them:** Repeating starts and stops, emotional whiplash, and regret hidden behind principle.
- **Cost to the other person:** Never knowing whether intimacy is welcome or being quietly revoked.
- **What is lost if it runs one more cycle:** Trust that boundaries can exist without abandonment.
- **Wound / injury / darkness underneath:** Fear of engulfment; learning that closeness has a price; fearing that surrender means erasure.

---

## Live vs missing

**Live now:** Swiss sky calculation; timezone conversion; three-clock dark-window API; angles and houses per scenario; major aspects; rule-based wound markers; heuristic GeoPresence; 64-portal expression layer; these three cards as a static demo deliverable.

**Missing:** AI Gateway prose generation for the rectification scenarios; lived-years / incident / social GeoPresence inputs; native Vedic Ashlesha calculation (the current engine labels it pending); a final UX that hides the scenario clock while allowing comparison and selection; no exact birth-time conclusion.

## One next ship step

Wire this exact API response into the existing foundation rectification page as three selectable cards, keeping the scenario clock in metadata only and replacing the static prose with the same card schema once the AI Gateway key is available.

## Reachability

No known Vercel/Forge URL was present in the local project metadata; no deploy attempted.
