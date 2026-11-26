# Input field

Single-line text input with label, hint and error. Also exports `FormField` (label + control + hint / error), which SelectField and NumberStepper reuse.

| File | What it is |
| --- | --- |
| `InputField.tsx` | **The spec.** Anatomy, sizes (36 / 40 / 44px, 12px side padding), states, accessibility, tokens, a typed `InputField` + `FormField` and an `InputFieldStates` gallery |

Prototype markup today: `.field` > `.field__label` + `input.input` (src/styles/15-focused-editor.css, 16-reviewers-setup.css, 22-section-rows.css).
