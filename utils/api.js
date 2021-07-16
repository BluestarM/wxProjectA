export const baseUrl = 'https://img.diet.itboye.com/v2/picture/upload';

// 登录
export const user_login = '/login'

// 退出登录
export const user_logout = '/logout'

// 获取用户的信息
export const user_infos = '/sys/user/get'

// 获取项目列表
export const project_list = '/dev/project/select/user/project'

// 压缩空气

// 获取汇总信息
export const real_data = '/acs/zutai/select/realData'

//系统浪费
export const waste_data = '/acs/zutai/select/wasteData'

// 获取能耗分析
export const tunnel_nergyTotal = '/acs/energy/select/tunnelEnergyTotal'

// 获取能耗分析-节能分析
export const tunnel_degreeFlow = '/acs/energy/select/tunnelDegreeFlow'

// 获取控制分析包括曲线图表数据
export const join_analyzeData = '/join/analyze/data'

// 获取设备列表
export const device_tree = '/dev/project/select/current/treeGroupAndDevice'

// 获取设备报告websocket
export const device_report = '/socket/device/attr/typeRealValue'

//所有空压机联控对象
export const control_list = '/join/control/compressor/list'

//根据id查询联控压力曲线
export const pressureCurve = '/join/control/'

// 获取联控压力曲线websocket
export const controlData_report = '/socket/join/controlData'


// 电力管理

// 电力运行时长分析
export const ele_runTimeAnalyse = '/ele/analyse/runTimeAnalyse'

// 电度分析
export const ele_eleAnalyse = '/ele/analyse/eleAnalyse'

// 某一天的各个设备的电度列表
export const ele_eleDetail = '/ele/analyse/eleDetail'

// 功率分析
export const ele_powerAnalyse = '/ele/analyse/powerAnalyse'

// 功率因数分析
export const ele_powerFactorAnalyse = '/ele/analyse/powerFactorAnalyse'


// 用水管理

// 用水运行时长分析
export const water_runTimeAnalyse = '/water/analyse/runTimeAnalyse'

// 用水分析
export const water_waterAnalyse = '/water/analyse/waterAnalyse'

// 某一天的各个设备的用水明细
export const water_waterDetail = '/water/analyse/waterDetail'


// 水蒸气管理

// 水蒸气分析
export const vapor_vaporAnalyse = '/vapor/analyse/vaporAnalyse'

// 抄录
export const vapor_vaporDayData = '/vapor/analyse/dayData'


