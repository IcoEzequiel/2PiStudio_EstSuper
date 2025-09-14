const DashboardService = require('../services/DashboardService')

const DashboardController = {
    getData: async (req, res) => {
        try {
            const data = await DashboardService.getDashboardData()
            res.status(200).json(data)
        } catch (error){
            res.status(500).json({ error: error.message})
        }
    }
}

module.exports = DashboardController