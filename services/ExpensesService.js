import axios from "axios";

const EXPENSES_API_BASE_URL = "http://localhost:8080/api/v1/expenses";

class ExpensesService {
    getExpenses(){
        return axios.get(EXPENSES_API_BASE_URL);
    }
}

export default new ExpensesService()