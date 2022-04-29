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
    "department_id": 1,
    "semester": 1
}

// -------------------------------- Subject allocation -------------------------- //

const subject_allocation = [
    {
        "subject_allocation_id": 1,
        "subject_id": 1,
        "faculty_id": 2
    },
    {
        "subject_allocation_id": 0, // For new subject allocation 
        "subject_id": 2,
        "faculty_id": 7
    },
    {
        "subject_allocation_id": 3,
        "subject_id": 3,
        "faculty_id": 11
    },
    {
        "subject_allocation_id": 4,
        "subject_id": 5,
        "faculty_id": 1
    }
]

// ----------------------------------- Time day ------------------------------------ //

const time_day = [
    {
        "time_day_id": 0, // For new data
        "day": 1,
        "time": 1,
        "subject_allocation_id": 8
    },
    {
        "time_day_id": 28,
        "day": 1,
        "time": 2,
        "subject_allocation_id": 9
    },
    {
        "time_day_id": 29,
        "day": 1,
        "time": 3,
        "subject_allocation_id": 10
    },
    {
        "time_day_id": 31,
        "day": 1,
        "time": 5,
        "subject_allocation_id": 11
    },
    {
        "time_day_id": 32,
        "day": 1,
        "time": 4,
        "subject_allocation_id": 10
    }
]