import { Link } from "react-router-dom";
import InputBox from "../components/input.component";
// import GoogleIcon from "../imgs/google.png"
import "../styles/userAuthForm.page.css"
import { useEffect, useRef, useState } from "react";
// import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const UserAuthForm = ({ type }) => {

    const authForm = useRef();
    const [error, setError] = useState("");


    const sendDataToServer = (serverRoute, formData) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
            .then(({ data, status }) => {
                console.log(data, "status : " + status);
            })
            .catch(({ response }) => {

                setError(response.data.error);
                console.log(response.data.error, "status : " + response.status);
            })
    };

    useEffect(() => {
        setError("");

    }, [type]); // Перевірка на зміну зміної


    //Обробляємо подію натискання кнопки авторизації/реєстрації
    const handleSubmit = (e) => {

        e.preventDefault();// Відміна надсилання форми

        let pathServer = type === "sing-in" ? "/signin" : "/signup";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // Шаблон для пошти
        let passwordRegex = /^(?=.*\d)(?=.*[a-zа-яєіїґ])(?=.*[A-ZА-ЯЄІЇҐ]).{6,20}$/; // Шаблон для пароля


        let form = new FormData(authForm.current);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }


        let { fullname, email, password } = formData;


        if (type !== "sign-in") {
            if (fullname === "") {
                setError("Ведіть ім'я")
                return console.log({ "error": "input fullname" })
            } else {
                if (fullname.length < 3) {
                    setError("Мінімальна довжина імені 3 символи")
                    return console.log({ "error": "error min length 3" })
                }
            }

        }


        if (!email.length) {
            setError("Ведіть електрону пошту");
            return console.log({ "error": "Enter email" })
        }
        if (!emailRegex.test(email)) {
            setError("Невірний формата електороної пошти");
            return console.log({ "error": "Email is invalid" })
        }
        if (type == "sign-in") {
            if (fullname === "");
            setError("Ведіть пароль !")
            return console.log({ "error": "Input password" });

        } else {
            if (!passwordRegex.test(password)) {
                setError("Пароль повинен бути від 6 до 20 симлолів, а також містити 1 велику малу та 1 велику букву")
                return console.log({ "error": "Password should be 6 to 20 characters Kong with a numeric, 1 lowercase and 1 uppercase letters" })
            }
        }

        setError("");
        console.log(formData);
        sendDataToServer(pathServer, formData);


    }

    return (
        <section className="section">
            <form ref={authForm} className="form">

                <Link to="/">
                    <button className="home-button">Home</button>
                </Link>
                <h1>{type == "sign-in" ? "Вітаю з поверненням !" : "Реєстрація"}</h1>

                {
                    type != "sign-in" ?
                        <InputBox
                            name="fullname"
                            type="text"
                            placeholder="Ім'я"
                        ></InputBox> : ""
                }
                <InputBox
                    name="email"
                    type="email"
                    placeholder="Пошта"
                ></InputBox>
                <InputBox
                    name="password"
                    type="password"
                    placeholder="Пароль"
                ></InputBox>

                <button type="submit" class="btn btn-primary" className="sing-in-button btn btn-primary" onClick={handleSubmit} >{type == "sing-in" ? "Увійти" : "Зареєструватися"}</button>
                {error && <p className="error-list" style={{ color: "red" }}>{error}</p>}                <button type="button" class="btn btn-primary" className="sing-in-button google-sing-in btn btn-primary" >
                    {/* <img src={GoogleIcon} className="google-icon" ></img> */}
                    Увійти за допомогою Google</button>

                {type == "sign-in" ?
                    <p className="redirect-link">Ви тут в перше ?<Link to="/signup" >Натисніть тут щоб зареєструватися</Link>
                    </p> :
                    <p className="redirect-link">Ви вже користувач ?<Link to="/signin" >Натисніть тут щоб авторизуватися</Link>
                    </p>

                }
            </form>

        </section>
    )
}
export default UserAuthForm;