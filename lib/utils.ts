import Swal from 'sweetalert2';

export class CommonTools {
    //used as delay sleep execution
    static delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // will auto get payload out of json and checks reports failures to user
    // throws exception if fail
    static async GetAPIPayload(url: string) {
        try {
            // Send the request to the specified URL with the prepared options
            const response = await fetch(url);

            // If the response is not ok (status is not in the range 200-299), throw an error
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse the response body as JSON
            const data = await response.json();

            // If the 'Status' property of the parsed data is not 'Pass', throw an error
            if (data.Status !== "Pass") {
                throw new Error(data.Payload);
            }

            // If everything is ok, return the 'Payload' property of the parsed data
            return data.Payload;
        } catch (error: any) {
            // If an error is caught, display an error message using Swal.fire
            Swal.fire({
                icon: "error",
                title: "App Crash!",
                text: error.toString(),
                confirmButtonText: "OK",
            });
        }
    }

    static ShowLoading() {
        Swal.fire({
            showConfirmButton: false,
            width: "280px",
            padding: "1px",
            allowOutsideClick: false,
            allowEscapeKey: false,
            // stopKeydownPropagation: true, // Not supported in all Swal versions/types, verify if needed
            // keydownListenerCapture: true,
            html: `<img src="/images/loading-animation-progress-transparent.gif">`,
        });
    }

    static HideLoading() {
        //hide loading box
        Swal.close();
    }

    /**
     * Converts a camelCase string to PascalCase.
     */
    static camelCaseToPascalCase(camelCaseStr: string) {
        if (camelCaseStr && typeof camelCaseStr === 'string') {
            return camelCaseStr.charAt(0).toUpperCase() + camelCaseStr.slice(1);
        } else {
            return camelCaseStr;
        }
    }


    //converts camel case to pascal case, like "settings.keyColumn" to "settings.KeyColumn"
    static CamelCaseKeysToPascalCase(obj: any): any {
        let newObj: any = Array.isArray(obj) ? [] : {};
        for (let key in obj) {
            let value = obj[key];
            let newKey = key.charAt(0).toUpperCase() + key.slice(1);
            if (value && typeof value === "object") {
                value = CommonTools.CamelCaseKeysToPascalCase(value);
            }
            newObj[newKey] = value;
        }
        return newObj;
    }

    /**
     * Takes a camel case or pascal case string and returns a string with spaces between the words.
     * Converts "MyNameIs" -> "My Name Is", "myNameIs" -> "My Name Is"
     */
    static CamelPascalCaseToSpaced(camelCase: string) {
        let result = camelCase
            .replace(/(\d)([A-Z])/g, '$1 $2')          // Insert space between a digit and uppercase letter
            .replace(/([a-z])([A-Z])/g, '$1 $2')       // Insert space between lowercase and uppercase letters
            .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')  // Insert space between consecutive uppercase letters followed by lowercase
            .trim();

        // Capitalize the first character if the original string starts with a lowercase letter
        if (camelCase[0] !== camelCase[0].toUpperCase()) {
            result = result.charAt(0).toUpperCase() + result.slice(1);
        }

        return result;
    }

    /**
     * Converts a name given in all caps to Pascal Case, but not initials.
     */
    static convertNameToPascalCase(name: string) {
        return name.split(' ').map(word => {
            // If the word is longer than 2 characters, it's probably not an initial
            if (word.length > 2) {
                // Convert the first character to uppercase and the rest to lowercase
                return word.charAt(0) + word.slice(1).toLowerCase();
            } else {
                // Leave the word as it is (all uppercase)
                return word;
            }
        }).join(' ');
    }

    /**
     * Converts text to URL-safe text.
     */
    static toUrlSafe(text: string) {
        return encodeURIComponent(text);
    }

    static IsMobile() {
        if (typeof navigator === 'undefined') return false;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Truncates a given text to a specified maximum length and appends an ellipsis.
     */
    static TruncateText(text: string, maxChars: number) {
        if (typeof text !== 'string') {
            throw new Error('Input text must be a string.');
        }

        if (typeof maxChars !== 'number' || maxChars <= 0) {
            throw new Error('Maximum characters must be a positive number.');
        }

        return text.length > maxChars ? `${text.substring(0, maxChars)}...` : text;
    }
}
