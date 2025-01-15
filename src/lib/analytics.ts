export function trackAnalytics(event:String, properties?: any) {
    console.log("trackAnalytics", event, properties)
    let wk = (window as any).webkit
    if (wk?.messageHandlers?.trackAnalytics) {
        let payload = {
            type: "trackAnalytics",
            payload: {
                event: event,
                properties: properties || {}
            }
        }
        wk.messageHandlers.trackAnalytics.postMessage(payload)
    } else {
        console.log("trackAnalytics is missing")
    }
}
