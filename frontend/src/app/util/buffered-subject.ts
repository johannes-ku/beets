import { Observable, ReplaySubject, Subscriber, SubscriptionLike } from 'rxjs';

export class BufferedSubject<T> extends Observable<T> implements SubscriptionLike {

  private replaySubject: ReplaySubject<T> = new ReplaySubject<T>();
  private activeSubscriber?: Subscriber<T>;
  readonly closed: false;

  constructor() {
    super((subscriber: Subscriber<T>) => {
      if (this.activeSubscriber != null) {
        throw new Error('BufferedSubject already has a subscription');
      }
      this.activeSubscriber = subscriber;
      this.replaySubject.subscribe(subscriber);
      return () => {
        this.activeSubscriber = null;
        this.replaySubject.complete();
        this.replaySubject = new ReplaySubject<T>();
      };
    });
  }

  next(value: T) {
    this.replaySubject.next(value);
  }

  unsubscribe() {
    this.replaySubject.unsubscribe();
  }

  hasSubscription(): boolean {
    return this.activeSubscriber != null;
  }


}
