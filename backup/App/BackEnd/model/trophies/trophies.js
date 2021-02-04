const Pool = require('pg').Pool
config = require("../dbconfig");
db = config.database;
const pool = new Pool(db);


//=================================

const getassstar = (request, response) => {
	const { uid, eid,year_status } = request.body;
	
	try{
		pool.connect((err, client, done) => {
			if (err) {
				done();
				return response.status(200).json({ status: "failed", code: 'SA020', message: "Internal Server Error on selecting AssStar" });
			}
			else {
				client.query('select cast(ROW_NUMBER () OVER (ORDER BY ass_status_id)as text) as countVal,* from gameasswisestar_maxbased($1,$2,$3) as t(ass_status_id bigint, \
					ass_m_starcnt bigint,ass_v_starcnt bigint,ass_f_starcnt bigint,ass_p_starcnt bigint,ass_l_starcnt bigint) order by ass_status_id', [uid, eid,year_status],
					(error, results) => {
						if (error) {
							done();
							return response.status(200).json({ status: "failed", code: 'SA021', message: "Internal Server Error on query selecting AssStar" });
						}
						else {
							done();
							return response.status(200).json({ status: 'success', code: 'SA000', getassstar: results.rows, message: "AssStar Selected Successfully" });

						}
					})
			}
		})
	}catch(e){
		return response.status(200).json({
			code: "SA120",
			status: "failed",
			message: "getassstar caused exception"
			});
	}
}



module.exports = { getassstar };


