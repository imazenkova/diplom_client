import React from "react";
import { EventCallBackMethods, Options, TabulatorFull as Tabulator } from "tabulator-tables";


Tabulator.extendModule("import", "importers", {
  jsonCustom: (fileContents: any) => {
    return JSON.parse(fileContents);
  },
});


interface TabulatorNativeProps {
  events?: Partial<EventCallBackMethods>
  options?: Options
}

export default class TabulatorNative extends React.Component<TabulatorNativeProps> {
  el: HTMLDivElement | null = null;

  public tabulator: Tabulator | null = null;

  componentDidMount() {
    if (this.el) {
      this.tabulator = new Tabulator(this.el, {
        ...this.props.options,
        reactiveData: false,
        history: false,
      });

      if (this.props?.events) {
        Object.keys(this.props.events).forEach((eventName: string) => {
          if (this.props.events) {
            const handler = this.props?.events[eventName as keyof EventCallBackMethods];
            this.tabulator?.on(eventName as keyof EventCallBackMethods, handler);
          }
        });
      }
    }
  }

  componentWillUnmount() {
    this.tabulator && this.tabulator.destroy();
  }

  componentDidUpdate(prevProps: TabulatorNativeProps) {
    const o = this.props.options
    const op = prevProps.options
    if (this.el && o && op) {
      if (o.data && o.data !== op.data) {
        this.tabulator?.setData(o.data);
      }
      if (o.columns && o.columns !== op.columns) {
        this.tabulator?.setColumns(o.columns);
      }
      if (o.height && o.height !== op.height) {
        this.tabulator?.setHeight(o.height);
      }
    }
  }

  render() {
    return (
      <>
        <div ref={el => (this.el = el)} />
      </>
    )
  }
}
