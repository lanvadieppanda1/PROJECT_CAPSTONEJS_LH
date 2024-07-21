// check empty

let checkEmpty = (elem, value) => {
    if (value === "") {
        elem.style.display = 'block';
        elem.textContent = "Not empty please!";
        return false;
    } else {
        elem.style.display = 'none';
        elem.textContent = "";
        return true;
    }
}