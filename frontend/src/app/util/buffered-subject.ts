import { Observable, ReplaySubject, Subscriber, SubscriptionLike } from 'rxjs';

export class BufferedSubject<T> extends Observable<T> implements SubscriptionLike {

  private replaySubject: ReplaySubject<T> = new ReplaySubject<T>();
  readonly closed: false;

  constructor() {
    super((subscriber: Subscriber<T>) => {
      this.replaySubject.subscribe(subscriber);
      return () => {
        this.replaySubject.complete();
        this.replaySubject = new ReplaySubject<T>();
      };
    });
  }

  next(value: T) {
    this.replaySubject.next(value);
  }

  unsubscribe(): void {
    this.replaySubject.unsubscribe();
  }

}
