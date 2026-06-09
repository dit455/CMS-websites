export interface DemoFeatureDetail {
  title: string;
  description?: string;
}

export const DEMO_FEATURE_EVENT = "tis:demo-feature";

export function openDemoFeature(title: string, description?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<DemoFeatureDetail>(DEMO_FEATURE_EVENT, { detail: { title, description } }));
}
