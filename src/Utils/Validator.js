function Validator(formRef) {
    let formElement = formRef.current;
    
    var _this = this;
    // Quy ước tạo rules:
    /**
     * Nếu có lỗi thì return `Error Mesage`
     * Nếu 0 có lỗi thì return undefined
     */
    /**
     * Object mô tả rules:
     * keys: name input
     * value : rules input
     */
    let formRules = {
        // email: "required|email"
    };
    let validatorRules = {
        required: (value) => {
            return value.trim() ? undefined : `Vui lòng nhập vào trường này`;
        },
        email: (value) => {
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value)
                ? undefined
                : `Vui lòng nhập đúng định dạng email`;
        },
        min: (min) => {
            return (value) => {
                return value.length >= min
                    ? undefined
                    : `Vui lòng nhập ${min} ký tự`;
            };
        },
        max: (max) => {
            return (value) => {
                return value.length <= max
                    ? undefined
                    : `Vui lòng nhập ít hơn ${max} ký tự `;
            };
        },
        
        numberMin: (min) => {
            return (value) => {
                return Number.parseInt(value) > Number.parseInt(min) ? undefined :`Vui lòng nhập lớn hơn ${min}`;
            }
        },
        numberMax: (max) => {
            return (value) => {
                return Number.parseInt(value) < max ? undefined :`Vui lòng nhập bé hơn ${max}`;
            }
        },
        isConfirmed: (selector) => {
            let oldValue = formElement.querySelector(selector).value;

            return (value) => {
                return value === oldValue
                    ? undefined
                    : `Ký tự nhập lại không trùng khớp`;
            };
        },
        isTextAlphabet: (value) => {
            let regex = /^[a-zA-z , ]+$/;
            return regex.test(value)
                ? undefined
                : `Vui lòng chỉ nhập chữ cái và không có ký tự đặc biệt`;
        },
        isNumber: (value) => {
            let regex = /^\d+$/;
            return regex.test(value) ? undefined : `Vui lòng chỉ nhập chữ số`;
        },
        // ở đây là các thuộc tính đơn trị => từ là nó trả về luôn message lỗi
        isAlphabetBlankAndNumber: (value) => {
            let regex = /^[\w ]*$/;
            return regex.test(value)
                ? undefined
                : `Vui lòng không nhập ký tự đặc biệt`;
        },
        // ở đây là thuộc tính đa trị => tức là nó sẽ trả về một function. và trong function đó nếu value ( tức là cái ta nhập vào ) sẽ so sánh với 
        // cái defaultValue. Nếu thỏa mãn thì tức là k có lỗi, nếu có lỗi thì trả về message lỗi
        // VD: đói với rule này: rules trong input: isGreaterOrEqualToDefaultValue:1000 => Ví dụ cái ta nhập vào là 100, DefaultValue = 1000. 100 >= 1000 sai => chuyển về
        // vế sau
        isGreaterOrEqualToDefaultValue:(defaultValue) => {
            return (value) => {
                return value >= defaultValue ? undefined : `Vui lòng nhập vào giá trị >= ${defaultValue}`;
            }
        },
        isEqualTo: (valueEqual) => {
            return (value) => {
                return value.length === Number.parseInt(valueEqual) ? undefined : `Vui lòng nhập đúng ${valueEqual} chữ số`
            }
        },
        isPhone : (value) => {
            const phoneRegex = /^0\d{9}$/;
            return phoneRegex.test(value) ? undefined : `Vui lòng số điện thoại 10 chữ số`;
        }, 
        isBeforeCurrent: (value) => {
            let currentDate = Date.parse(value);
            return currentDate - Date.now() <= 0 ? undefined : `Vui lòng nhập trước ngày hôm nay!`;
        }
    }

    // Chỉ xử lý khi có element trong DOM
    if (formElement) {
        
        //Trả về NodeList
        let inputElements = formElement.querySelectorAll(["[name][rules]"]);

        // Lặp từng element để lấy ra được rule của nó
        for (let inputElement of inputElements) {
            // Một input có thể được áp nhiều rules
            let rules = inputElement.getAttribute("rules").split("|");

            // lặp qua từng rule của input để get được dãy phần tử
            let ruleArray = [];
            for (let i = 0; i < rules.length; i++) {
                let ruleInfo = rules[i];

                if (ruleInfo.includes(":")) {
                    ruleInfo = rules[i].split(":");
                }

                // Kiểm tra xem cả Rule info này có phải là một array sau khi được split không
                // min:6 =>[min, 6]
                // isConfirmed:#password
                if (Array.isArray(ruleInfo)) {
                    // nếu là thuộc tính đa trị thì thực hiện dòng này
                    ruleArray.push(validatorRules[ruleInfo[0]](ruleInfo[1]));
                } else {
                    // nếu là thuộc tính đơn trị
                    ruleArray.push(validatorRules[ruleInfo]);
                }
            }

            formRules[inputElement.name] = ruleArray;

            // Lắng nghe sự kiện để Validate (blur, change, keypress)
            inputElement.onblur = handleValidate;
            inputElement.oninput = handleInput;
        }

        // xywr
    }
    let getParent = (element, selector) => {
        while (!element.matches(selector)) {
            element = element.parentElement;
        }

        return element;
    };
    // thực hiện thông báo message lỗi khi người dùng có các hành vi mà bay ra khỏi ô input
    function handleValidate(event) {
        // console.log(event.target.name);
        let ruleOfArrayFunction = formRules[event.target.name];

        // console.log(ruleOfArrayFunction);

        let errorMessage;

        /// Nếu cỗ thì break ra luôn và ta có được message để apeen vào thẻ cha chứa nó
        for (let ruleFunction of ruleOfArrayFunction) {
            errorMessage = ruleFunction(event.target.value);
            if (errorMessage) {
                let parentNode = getParent(event.target, ".form-group");

                parentNode.classList.add("invalid");

                let messageNode = parentNode.querySelector(".form-message");
                messageNode.innerText = errorMessage;
                break;
            }
        }

        return !errorMessage;
    }
    // xóa đi các message lỗi khi người dùng quay trở lại bấm vào ô input
    function handleInput(event) {
        let fomrGroup = getParent(event.target, ".form-group");
        if (fomrGroup.classList.contains("invalid")) {
            fomrGroup.classList.remove("invalid");
        }
        let messageNode = fomrGroup.querySelector(".form-message");
        messageNode.innerText = "";
    }

    // Xử lý hành vi submit form
    formElement.onsubmit = function (event) {
        event.preventDefault();
        let inputElments = formElement.querySelectorAll(["[name][rules]"]);
        let isValid = true;
        let inputElementArray = Array.from(inputElments);
        for (let i = 0; i < inputElementArray.length; i++) {
            if (!handleValidate({ target: inputElementArray[i] })) {
                isValid = false;
            }
        }
        if (isValid) {
            if (typeof _this.onSubmit === "function") {
                var enableInputs = formElement.querySelectorAll("[name]");
                var formValues = Array.from(enableInputs).reduce(function (
                    values,
                    input
                ) {
                    // console.log(input.type);
                    switch (input.type) {
                        case "radio":
                            values[input.name] = formElement.querySelector(
                                'input[name="' + input.name + '"]:checked'
                            ).value;
                            break;
                        case "checkbox":
                            if (!input.matches(":checked")) {
                                values[input.name] = "";
                                return values;
                            }
                            if (!Array.isArray(values[input.name])) {
                                values[input.name] = [];
                            }
                            values[input.name].push(input.value);
                            break;
                        case "file":
                            values[input.name] = input.files;
                            break;
                        case "select-one":
                            values[input.name] = input.value;
                            break;
                        default:
                            values[input.name] = input.value;
                    }

                    return values;
                },
                {});
                Array.from(enableInputs).forEach((input) => (input.value = ""));
                _this.onSubmit(formValues);
            }
            // Trường hợp submit với hành vi mặc định
            else {
                formElement.submit();
            }
        }
        // Array.from(inputElments).forEach((input) => {
        //     if(!handleValidate({ target: input })){
        //         isValid = false;

        //     }
        // });
    };
}

export { Validator };
