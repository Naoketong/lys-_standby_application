const knex = require('./knex');

class Base {
  constructor(props) {
    this.table = props;
  }

  knex(){
    return knex(this.table)
  }

  all(){/*获取所有信息*/
    return knex(this.table).select()
  }

  allManager(){/*获取所有信息 管理员*/
    return knex(this.table).select().whereNull('isdeleted')
  }
  

  select(params) {/*获取单独信息*/
    return knex(this.table).select().where(params)
  }

  // seek(name,params) {/*获取单独信息*/
  //   return knex(this.table).where(name).select()
  // }

  where(params) {
    return knex(this.table).where(params);
  }

  show(params) {
    return knex(this.table).where(params).select();
  }

  insert(params){/*提交信息*/
    return knex(this.table).insert( params )
  }

  update(id, params ){/*修改单独信息*/
    return knex(this.table).where('id', '=', id).update( params )
  }

  delete(id){/*删除信息 硬删除*/
    return knex(this.table).where('id', '=', id).del()
  }

  count(params, dateFilter={}) {
    if(dateFilter.column) {
      return knex(this.table).where(params)
      .whereBetween(dateFilter.column,[`${dateFilter.startAt} 00:00`, `${dateFilter.endAt} 23:59`])
      .count('id as total');
    }else{
      return knex(this.table).where(params).count('id as total');
    } 
  }

  pagination (pageSize = 20, currentPage = 1, params={}, dateFilter={}) {
    let offset = (currentPage - 1) * pageSize;
    if(dateFilter.column) {
      return knex(this.table)
        .where(params)
        .whereNull('isdeleted')
        .offset(offset)
        .limit(pageSize)
        .whereBetween(dateFilter.column,[`${dateFilter.startAt} 00:00`, `${dateFilter.endAt} 23:59`])
        .select()

    }else{
      return knex(this.table)
        .where(params)
        .whereNull('isdeleted')
        .offset(offset)
        .limit(pageSize)
        .select()
    }
  }
}

module.exports = Base;

