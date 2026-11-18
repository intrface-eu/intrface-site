/**
 * Runs the contact action from the browser and never throws.
 *
 * The call can reject on its own: the network drops, the server answers with
 * an error page, or the response is lost after the server already stored or
 * sent the inquiry. Unhandled, that rejection reaches the error boundary and
 * the page loses what the visitor typed. Here it becomes `uncertain`: the form
 * keeps the entry and its submission id, and says it could not confirm
 * delivery rather than that nothing arrived. A retry carries the same id, so
 * Prism and Resend treat it as the same inquiry.
 */
export type Uncertain = { status: "uncertain" };

export async function settleSubmission<T>(send: () => Promise<T>): Promise<T | Uncertain> {
  try {
    return await send();
  } catch (error) {
    console.error("[contact] could not confirm the submission", error);
    return { status: "uncertain" };
  }
}
