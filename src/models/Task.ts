import {  DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

class Task extends Model {
    public id!: number;
    public user_id!: number;
    public title!: string;
    public description!: string;
    public status!: boolean; 
   
}

Task.init(
    {
        user_id: {  
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.BOOLEAN, 
            defaultValue: false,     
        },
        
    },
    {
        sequelize,
        modelName: 'tasks',
    }
);

export default Task;
