# React Design Decisions
The React app is kept simple, for now, and is composed of a couple of distinct components. I believe I did a good job separating the concerns for each components. Making sure that each component is assigned to one particular task. For example, getting rid of business logic in each components...offshoring all parsing utilities into its own separate helper module. 

These two are the main components used for the app.

## <MainContainer />
The main container of the app, main entry for API and file. Passes down both existing data from the API and file data into the <PayrollInformation /> component. 

## <PayrollInformation />
This component cooks up the data using *ReactTable*. Comes with a 

# API Models 
There are three tables that are used to create the API, fairly simple. All stored in SQLite for simplicity. I tried to follow best practices and approach to REST.
## Report Table
The report table stores the user generated `report_id`. The `id` here is the primary key for this table. I believe that having a primary key is not inherently a bad decision to do, it future proofs against weird joins. Fast lookups when looking for duplicated `report_id`.
| Column | Explanation |
| --- | --- |
| id | Primary key, future proofing |
| report_id | Key supplied by the user we have no control over |
| date_created | Date inserted into the table |

## Time Report Table
The time report table stores the time report data supplied by the csv file. The `id` here also refers to the primary key of this table.
| Time Report | Explanation |
| --- | --- |
| id | Primary key |
| report_id | Key supplied by the user |
| employee_id | Key supplied by the user |
| job_group | "Key" supplied by the user |
| date | Date an employee worked |

## Job Group Table
The job group table stores information about different job group and pay rates. Having it on a table means that we may be able to keep track of historical data say a job group changes value in the future.
| Job Group | Explanation |
| --- | --- |
| id | Primary key | 
| job_group | "Key" supplied by the user |
| rate | Hourly rate |

# What can I improve on?
A lot of things can be improved here. Definitely things aren't production ready, a lot more time probably is needed to have everything squeaky clean. I decided to cut short on a bunch of different areas. TDD is particularly a goal to make habit for my next projects. Unit testing was only setup on the frontend side, did not follow TDD for this project :(
- Containerization ala docker
- Creating a more reusable React components
- Practice more TDD!
	- With mocha-chai-enzyme-sinon
	- Python/Django unit testing
- Documentation improvements, working on it
- UI feel/look, "pixel perfect"? UI improvements in general
- More commits, more feature branching

# Thanks
Would love feedback if possible, otherwise thank you!
github@aulb
