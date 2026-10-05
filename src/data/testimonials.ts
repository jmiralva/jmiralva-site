// Testimonials. /testimonials shows all of them in full, with the lead one as the
// big opening quote. The home page shows only the names in `homeFeaturedNames`,
// using `snippet` when there is one. If a snippet cuts into a sentence, show the
// cut with "…".

export interface Testimonial {
  quote: string;
  /** Shorter excerpt for the home page */
  snippet?: string;
  name: string;
  /** LinkedIn profile; the name shows as plain text if this is missing */
  nameUrl?: string;
  /**
   * Their title and company from when they worked with Jorge, not today's.
   * If it changed while they overlapped, use the most senior one they held.
   */
  role: string;
  /** Their current title and company, if they've moved on since (shown as "Now …") */
  now?: string;
}

export const leadTestimonialName = 'Paul Ford';
export const homeFeaturedNames = ['Vicky Volvovski', 'Chris LoSacco', 'Bronwyn Larsen'];

export const testimonials: Testimonial[] = [
  {
    quote: "Jorge is a driving force behind many improvements on the PM team. Some are behind the scenes, which help our team operate smoothly. Others are big & experimental. I'm consistently impressed by the thoughtfulness and thoroughness that he brings to his work.",
    snippet: "I'm consistently impressed by the thoughtfulness and thoroughness that he brings to his work.",
    name: "Vicky Volvovski",
    nameUrl: "https://www.linkedin.com/in/vickyvolvovski/",
    role: "Head of Product Management, Postlight",
    now: "Head of Product, Conduit Tech"
  },
  {
    quote: "An incredibly skilled product thinker, strategist, and lead — one of the best I've worked with.",
    name: "Chris LoSacco",
    nameUrl: "https://www.linkedin.com/in/closacco/",
    role: "President, Postlight",
    now: "VP of Solution Architecture, Launch by NTT Data"
  },
  {
    quote: "Jorge helped build this place. It truly would not have been the same Postlight without him and I'm grateful we got to work with him.",
    name: "Paul Ford",
    nameUrl: "https://www.linkedin.com/in/ftrain/",
    role: "Co-Founder & CEO, Postlight",
    now: "Co-Founder, Aboard"
  },
  {
    quote: "Jorge is a thoughtful leader and good at identifying problems from their origin and addressing them. Anyone would be lucky to have him on their team!",
    name: "Vinod Periasamy",
    nameUrl: "https://www.linkedin.com/in/vinod-periasamy/",
    role: "Engineering Manager, Zapier",
    now: "Director of Data, Multi Media, LLC"
  },
  {
    quote: "Jorge was clear with me about process, expectations, and scope. He was flexible, open to suggestions and feedback, and yet it was clear he knew how to deliver results. His attention to detail, expansive product knowledge, strategic thinking, and clear project management made him someone I would be thankful to work with time and time again.",
    name: "Grace Sunnell",
    nameUrl: "https://www.linkedin.com/in/gsunnell/",
    role: "Lead Product Designer, Postlight",
    now: "Principal Product Designer, Slack"
  },
  {
    quote: "Jorge leads the way with the kind of impact that typically takes years. But he's been able to accumulate in less than a year and does it with generosity, vision and infectious energy.",
    name: "Kate Mortenson",
    nameUrl: "https://www.linkedin.com/in/kate-m-07a521bb/",
    role: "Product Manager, Linnworks"
  },
  {
    snippet: "…an outstanding product manager and a joy to work with.",
    quote: "Jorge is an outstanding product manager and a joy to work with. As a UX researcher, I was deeply impressed by Jorge's ability to take stock of a business problem, and weave together a strategy that included customer research, technical requirements, and design needs. Jorge values the perspectives of his team: he listens attentively and implements changes thoughtfully.",
    name: "Bronwyn Larsen",
    nameUrl: "https://www.linkedin.com/in/bronwyn-larsen-81750242/",
    role: "Senior UX Researcher, Zapier"
  },
  {
    quote: "Jorge is an exceptional product thinker and is leaving behind a place that has grown tremendously as direct result of his collaboration and leadership. We really appreciate what he brought to Postlight, culturally, ethically and as a great practitioner.",
    name: "Rich Ziade",
    nameUrl: "https://www.linkedin.com/in/rich-ziade-a600221/",
    role: "Co-Founder & President, Postlight",
    now: "Co-Founder, Aboard"
  },
  {
    quote: "Jorge was a voice of reason during our short timeline. He pulled us back when we were over-ambitious and directed the project scope to a manageable place. He was very thoughtful with his feedback as we worked through the many small design details.",
    name: "Andrew Possehl",
    nameUrl: "https://www.linkedin.com/in/possehl/",
    role: "Lead Product Designer, Postlight",
    now: "Product Designer, Meta"
  },
  {
    quote: "Jorge is a great listener, mentor, and people / product manager. I've learned a lot from him, and I'm grateful for how he has advocated for me.",
    name: "Lindsey Fogle",
    nameUrl: "https://www.linkedin.com/in/lindseyfogle/",
    role: "Product Manager, Postlight",
    now: "Group Product Manager, Discourse"
  },
  {
    quote: "Jorge has played a key role in improving the Developer Platform team's own processes, as well as relationships with internal and external stakeholders.",
    name: "Fokke Zandbergen",
    nameUrl: "https://www.linkedin.com/in/fokkezb/",
    role: "Staff Engineer, Zapier"
  }
];

// Fails the build with a clear message if a featured name doesn't match an entry above.
function byName(name: string): Testimonial {
  const match = testimonials.find((t) => t.name === name);
  if (!match) throw new Error(`No testimonial named "${name}" in src/data/testimonials.ts`);
  return match;
}

export const leadTestimonial = byName(leadTestimonialName);
export const otherTestimonials = testimonials.filter((t) => t !== leadTestimonial);
export const homeTestimonials = homeFeaturedNames.map(byName);
