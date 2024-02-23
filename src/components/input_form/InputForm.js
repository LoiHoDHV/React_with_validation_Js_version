import { useRef } from "react";
import { Validator } from "../../Utils/Validator";
function InputForm(props) {
    let formInputRef = useRef(undefined);


    // call back về function của thằng cha
    // tìm hiểu thêm về object destructuring 
    let {updateListToDoByAddingOne} = props

    // Function này dành cho sự kiện onChange của từng input có rules
    // ví dụ với input có rule required mà khi tab ra mà khi chưa nhập vào
    // sẽ báo là trường này là bắt buộc
    // Nếu muốn validate chỉ riêng ô input thì nó phải truyền theo kiểu function
    // Validator( cái useRef mà mình trỏ về form)
    let handleInputValidate = () => {
        Validator(formInputRef);
    };

    // Function này danh cho sự kiện onsubmit của toàn form
    // nếu các ô input không đáp ứng đủ điều kiện thì không cho submit 
    // Nếu các ô input đáp ứng đủ điều kiện thì cho submit => ở đây hành vi submit được biểu diễn là log ra cái data
    // ví dụ ở đây
    // formData = {
    //     "inputItem": "input mình dã nhập vào" VD: {inputItem: '123456'}
    // }
    // đối với khi mà update lên một state của thằng cha thì phải truyền nó lên thằng cha thông qua callback
    // Nếu muốn validate toàn form thì bắt buộc ta phải tạo nó theo kiểu đối tượng 

    // biến validator = new Validator( cái useRef mà mình trỏ về form)
    let handleSubmit = () => {
        let formValidator = new Validator(formInputRef);
        formValidator.onSubmit = (formData) => {
            // khi mà các validate đều thành công( không có lỗi thì nó sẽ gọi call back từ thằng cha => đọc định nghĩa truyền data từ con lên cha trong react)
            updateListToDoByAddingOne(formData)
        };
    };

    // Function này dùng để render vào cái form
    const renderInput = () => {
        let fomrInput = (
            <>
            {/* 1.Bắt buộc các form phải được gói trong element form
                2. Các thẻ input trong form phải được gói trong một div trong fomr-group. tùy thuộc vào form đó yêu cầu gì và tùy biến
                3. Đê validate được thì trong form phải có một nút button có kiểu là submit => truyền cái thuộc tính onSubmit = { () => function mình muốn gọi để xử lý khi mà hành động submit diễn ra}
                4. Để validate được các thẻ input khi người dùng blur ra khỏi thẻ thì trong input phải có một thuộc tính là onChange = { () => function mà mình handle nó }
             */}
                <form action="#" className="" ref={formInputRef}>
                    <div className="form-group">
                        {/* // trong mỗi ô input, nếu cần validate thì phải thêm thuộc tính rules này
                        // Các rule nếu có một thuộc tính đơn trị như: bắt buộc, là số => truyền vào là required, isNumber
                        // Các rule nếu có thuộc tính đa trị như là: phải lớn hơn hoặc bằng 1000 => truyền vào rules:isGreaterOrEqualToDefaultValue:1000
                        // Các rule được cách nhau bởi dấu |. Ví dụ. Bắt buộc, là số, >= 1000. rules = "required|isNumber|isGreaterOrEqualToDefaultValue:1000"
                         */}
                        <input
                            type="text"
                            name="inputItem"
                            id="inputItem"
                            rules="required|isNumber" 
                            onChange={() => handleInputValidate()}
                        />
                        <div>
                            <span className="form-message"></span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-md btn-primary ml-5"
                        onClick={() => {
                            handleSubmit();
                        }}
                    >
                        Cick to add
                    </button>
                </form>
            </>
        );

        return fomrInput;
    };

    return <>{renderInput()}</>;
}

export default InputForm;
