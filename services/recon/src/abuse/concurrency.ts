export class ConcurrencyManager {
  private activeJobs = 0;
  private readonly maxConcurrent: number;

  constructor(maxConcurrent = 2) {
    this.maxConcurrent = maxConcurrent;
  }

  public tryAcquire(): boolean {
    if (this.activeJobs >= this.maxConcurrent) {
      return false;
    }
    this.activeJobs++;
    return true;
  }

  public release(): void {
    if (this.activeJobs > 0) {
      this.activeJobs--;
    }
  }

  public getStatus(): { active: number; max: number; available: boolean } {
    return {
      active: this.activeJobs,
      max: this.maxConcurrent,
      available: this.activeJobs < this.maxConcurrent,
    };
  }

  public reset(): void {
    this.activeJobs = 0;
  }
}

export const globalConcurrency = new ConcurrencyManager(2);
