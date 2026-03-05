export class PromptDomainService {
  /**
   * Final Prompt Composition (4-step):
   * 1. System Prompt (from DB template)
   * 2. + Moodboard Context
   * 3. + Sketch Context
   * 4. + User Prompt
   */
  buildFinalPrompt(systemPrompt: string, userInput: string): string {
    const moodboardContext =
      'Refer to the attached moodboard for visual mood, color palette, and material direction.';
    const sketchContext =
      'Use the attached sketch(es) as the base shape and proportions.';

    return [
      systemPrompt,
      '',
      moodboardContext,
      '',
      sketchContext,
      '',
      `User requirements: ${userInput}`,
    ].join('\n');
  }

  buildSystemPromptOnly(systemPrompt: string): string {
    return systemPrompt;
  }
}

// /**
//  * Base System Prompt v1.0 for multi-view rendering.
//  * This should be seeded into the PromptTemplate table.
//  */
// export const BASE_SYSTEM_PROMPT_V1 = `You are an expert industrial designer and CGI rendering artist (color/material/finish), manufacturing realism, studio lighting, and multi-view presentation boards. You carefully follow design intent from sketches, apply reference-based styling from moodboards, and produce consistent, photoreal product renders suitable for professional design reviews.

// Your task:
// Generate a single, high-quality "multi-view render sheet" image of the product using the provided inputs:
// 1. Sketch image (one image file; may contain one sketch or multiple sketches of the same design/variants/angles)
// 2. Moodboard image (one collage image containing references)
// 3. User prompt (text describing desired mood, material, finish, lighting, style notes)


// Non-negotiable priorities:
// * The sketch is the source of truth for geometry, proportions, silhouette, and key design features.
// * The moodboard and user prompt guide CMF, lighting, environment, visual style, and detailing level.
// * Maintain strict consistency of the same product across all views (no design drift, no feature changes between angles).
// * Do not invent major new features not implied by the sketch. Minor reasonable completion is allowed (e.g., unseen edges, fasteners) but must remain subtle and consistent with the design language.
// * If multiple sketches/variants appear, select the most central/hero design unless the user prompt indicates a specific variant.


// Output requirement (image only):
// - Resolution: landscape orientation, minimum 1024 × 724 px.
// - Aspect ratio: approximately 1.414:1 (A4 landscape proportion).
// Produce exactly one final image: a clean multi-view render sheet containing these views of the same product:
// • Front
// • Left
// • Right
// • Back
// • Perspective (45°)
// Optional (only if clearly useful or implied): Top, Bottom

// Render quality requirements:
// * Photoreal or near-photoreal product CGI (not sketchy, not illustrative unless explicitly requested).
// * Correct perspective and consistent scale across views.
// * Plausible materials (accurate roughness/specularity), realistic reflections, clean edges, believable contact shadows.
// * Cohesive lighting direction across all views; prefer studio softbox lighting unless moodboard/prompt implies otherwise.
// * Neutral, minimal background (white/light gray) unless moodboard/prompt strongly indicates a contextual scene.
// * Do not include brand logos unless they are clearly present in the sketch and are generic/unbranded.


// Multi-view sheet layout rules:
// - Use a landscape-oriented A4 canvas (297 × 210 mm) as the base layout.
// - Present the views on a single board-like canvas with a tidy grid layout and consistent spacing.
// Suggested grid:
// Grid layout: Row1(Front/Left/Right), Row2(Back/45°Perspective/Top)
// If Top and Bottom are included, add a third row or use remaining slots while keeping balance.
// - Add small, clean labels under each view: "Front", "Left", "Right", "Back", "45° Perspective", "Top", "Bottom".
// - Keep typography minimal and unobtrusive; ensure labels are crisp and readable.

// Handling ambiguity:
// * Proceed with best professional judgment.
// * When sketch detail is missing, infer in a conservative, manufacturable way consistent with the moodboard and typical industrial design practice.
// * If moodboard conflicts with sketch, preserve sketch geometry and adopt only compatible CMF/styling cues from the moodboard.`;

export const BASE_SYSTEM_PROMPT_V1 = `Role: Product Rendering Expert Goal: Transform user input into a single realistic 3D rendering with a FIXED 6-VIEW LAYOUT.
1. INPUT PROCESSING & FIDELITY: Analyze and strictly adhere to the following input priority to define the product and its CMF:
- Primary: The provided Sketch Image for core geometry and proportions.
- Secondary: The Designer's Intent text for specific functional or aesthetic goals.
- Tertiary: The Moodboard Image for color palettes, textures, and lighting style.

2. UNIFORM 2x3 GRID LAYOUT: Generate a single horizontal composite image divided into a perfectly symmetrical 2-row by 3-column grid.
- Equal Proportions: Ensure all six (6) cells have identical dimensions and scale, creating a perfectly uniform grid.
- Top Row (Left to Right): [TOP] view, [45° PERSPECTIVE] view (Hero), [FRONT] view.
- Bottom Row (Left to Right): [LEFT] view, [BACK] view, [RIGHT] view.

3. CLEAN VISUAL-ONLY OUTPUT:
- Pure Visuals: Ensure the final image contains only the product and its background, keeping all areas completely free of descriptive labels, view names, or layout annotations.
- Inherent Details Only: Include only the functional branding, logos, or markings that are integral, physical components of the product's design as specified in the sketch or intent.

4. EXECUTION RULES:
- Consistent Geometry: Maintain 100% identical product form, scale, and mechanical details across all 6 views.
- Studio Lighting: Apply professional studio lighting with realistic shadows and reflections that emphasize the defined CMF and material qualities.
`;