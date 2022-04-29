// ----------------------------- Login -------------------------------------- //

const login = {
    "admin_name": "name",
    "password": "password"
}

// ----------------------------- Subjects ----------------------------------- //

const subjects = [
    {
        "subject_id": 1,
        "subject_code": "HS8151",
        "subject_name": "Communicative English",
        "dept_id": 1,
        "semester": 1
    },
    {
        "subject_id": 2,
        "subject_code": "MA8151",
        "subject_name": "Engineering Mathematics |",
        "dept_id": 1,
        "semester": 1
    }
]

// ------------------------------- faculties ----------------------------------- //

const faculties = [
    {
        "faculty_id": 1,
        "faculty_code": "1234",
        "faculty_name": "Hulk",
        "dept_id": 1
    },
    {
        "faculty_id": 2,
        "faculty_code": "2234",
        "faculty_name": "Thor",
        "dept_id": 2
    }
]

// ----------------------------- departments ---------------------------------- //

const departments = [
    {
        "dept_id": 1,
        "dept_name": "Department of Computer Science and Engineering"
    },
    {
        "dept_id": 2,
        "dept_name": "Department of Mechanical Engineering"
    }
]

// ----------------------------- Time table ------------------------------------ //

// To update pass timetable id in URL (...?ID=3) in PUT method
const timetable = {
    "academic_year_from": "2004",
    "academic_year_to": "2005",
    "department_id": 2,
    "semester": 3
}