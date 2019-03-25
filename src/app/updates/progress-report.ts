export interface ProgressReport {
	actual?: number;
	total?: number;
	action: string;
	mode: "determinate" | "indeterminate";
}
