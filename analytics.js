(function () {
    "use strict";

    // Replace with your GA4 Measurement ID, e.g. "G-ABC123XYZ9".
    const MEASUREMENT_ID = "G-0MYVB4E6RR";

    if (!MEASUREMENT_ID || MEASUREMENT_ID === "G-REPLACE_ME") {
        console.warn("Analytics disabled: set MEASUREMENT_ID in analytics.js");
        return;
    }

    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
        window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", MEASUREMENT_ID, {
        send_page_view: true
    });

    const pageStartMs = Date.now();
    let pageTimeSent = false;

    function sendTimeOnPage() {
        if (pageTimeSent) return;
        pageTimeSent = true;

        const seconds = Math.max(1, Math.round((Date.now() - pageStartMs) / 1000));
        gtag("event", "time_on_page", {
            page_path: window.location.pathname,
            page_title: document.title,
            seconds: seconds,
            non_interaction: true
        });
    }

    // Fires reliably when the user leaves, including mobile tab switches.
    window.addEventListener("pagehide", sendTimeOnPage);

    document.addEventListener("click", function (event) {
        const anchor = event.target.closest("a[href]");
        if (!anchor) return;

        const href = (anchor.getAttribute("href") || "").toLowerCase();

        // Checkout conversion tracking.
        if (href.includes("buy.stripe.com")) {
            gtag("event", "begin_checkout", {
                currency: "USD",
                value: 69.99,
                item_name: "Hollow 0W",
                page_path: window.location.pathname
            });
            return;
        }

        // Optional custom event hooks via data attributes.
        const customEvent = anchor.getAttribute("data-analytics-event");
        if (customEvent) {
            gtag("event", customEvent, {
                page_path: window.location.pathname,
                link_text: (anchor.textContent || "").trim(),
                link_href: anchor.getAttribute("href") || ""
            });
        }
    }, true);
})();
