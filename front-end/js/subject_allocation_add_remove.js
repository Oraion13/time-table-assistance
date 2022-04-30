const subject_allocation = document.getElementById('subject_allocation');
const subject_allocation_form = document.getElementById('subject_allocation_form');
const add_sa  = document.getElementById('add_sa');

let subject_allocation_arr = [];

add_sa.addEventListener("click", add_an_elem);
let index = 0;
let db_index = 0;
const elem = `<section id="sub_fac data-db-index="` + db_index + `">` +
             `<section id="subject">` +
                `<label for="subject_code">subject code</label>` +
                `<select name="" id="subject_code">` +
                    `<option value="" data-subject-id="">Choose Subject Code...</option>` +
                `</select>` +
                `<label for="subject_name"></label>` +
                `<input type="text" id="subject_name" placeholder="Subject Name" data-subject="" disabled>` +
            `</section>` +
            `<section id="faculty">` +
                `<label for="faculty_code">faculty code</label>` +
                `<select name="" id="faculty_code">` +
                    `<option value="" data-faculty-id="">Choose faculty Code...</option>` +
                `</select>` +
                `<label for="faculty_name"></label>` +
                `<input type="text" id="faculty_name" placeholder="faculty Name" data-faculty="" disabled>` +
            `</section>` +
            `<button id="add_ss" data-index="` + index + `" onclick="remove_elem(` + index + `)">-</button>` +
        `</section>`;

function add_an_elem(){
    index = subject_allocation_arr.length - 1;
    subject_allocation_arr.push(elem);
    
    let out = ``;
    subject_allocation_arr.map((sa) => {
        out += sa;
    })

    document.getElementById('subject_allocation').innerHTML = out;
}

function remove_elem(i){
    subject_allocation_arr.splice(i, 1);

    let out = ``;
    subject_allocation_arr.map((sa) => {
        out += sa;
    })

    document.getElementById('subject_allocation').innerHTML = out;
}