'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20260306041732 extends Migration {

  async up() {
    this.addSql(`create table \`PromptTemplate\` (\`id\` varchar(36) not null, \`name\` varchar(255) not null, \`content\` text not null, \`version\` int not null default 1, \`isActive\` tinyint(1) not null default true, \`createdAt\` datetime not null, \`updatedAt\` datetime not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`User\` (\`id\` varchar(36) not null, \`email\` varchar(255) not null, \`name\` varchar(255) not null, \`createdAt\` datetime not null, \`updatedAt\` datetime not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`User\` add unique \`User_email_unique\`(\`email\`);`);

    this.addSql(`create table \`Project\` (\`id\` varchar(36) not null, \`userId\` varchar(36) not null, \`title\` varchar(255) not null, \`description\` varchar(255) null, \`createdAt\` datetime not null, \`updatedAt\` datetime not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`Project\` add index \`Project_userId_index\`(\`userId\`);`);

    this.addSql(`create table \`Sketch\` (\`id\` varchar(36) not null, \`projectId\` varchar(36) not null, \`imageUrl\` varchar(255) not null, \`filename\` varchar(255) not null, \`sortOrder\` int not null default 0, \`createdAt\` datetime not null, \`updatedAt\` datetime not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`Sketch\` add index \`Sketch_projectId_index\`(\`projectId\`);`);

    this.addSql(`create table \`Prompt\` (\`id\` varchar(36) not null, \`projectId\` varchar(36) not null, \`templateId\` varchar(36) null, \`userInput\` text not null, \`finalPrompt\` text not null, \`createdAt\` datetime not null, \`updatedAt\` datetime not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`Prompt\` add index \`Prompt_projectId_index\`(\`projectId\`);`);
    this.addSql(`alter table \`Prompt\` add index \`Prompt_templateId_index\`(\`templateId\`);`);

    this.addSql(`create table \`Rendering\` (\`id\` varchar(36) not null, \`projectId\` varchar(36) not null, \`promptId\` varchar(36) not null, \`resultUrl\` varchar(255) null, \`status\` enum('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') not null default 'PENDING', \`viewType\` enum('COMBINED', 'FRONT', 'LEFT', 'RIGHT', 'BACK', 'PERSPECTIVE', 'TOP', 'BOTTOM') not null default 'COMBINED', \`errorMessage\` varchar(255) null, \`createdAt\` datetime not null, \`updatedAt\` datetime not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`Rendering\` add index \`Rendering_projectId_index\`(\`projectId\`);`);
    this.addSql(`alter table \`Rendering\` add index \`Rendering_promptId_index\`(\`promptId\`);`);

    this.addSql(`create table \`Moodboard\` (\`id\` varchar(36) not null, \`projectId\` varchar(36) not null, \`imageUrls\` json not null default ('[]'), \`combinedUrl\` varchar(255) null, \`characteristics\` varchar(255) null, \`createdAt\` datetime not null, \`updatedAt\` datetime not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`Moodboard\` add unique \`Moodboard_projectId_unique\`(\`projectId\`);`);

    this.addSql(`alter table \`Project\` add constraint \`Project_userId_foreign\` foreign key (\`userId\`) references \`User\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`Sketch\` add constraint \`Sketch_projectId_foreign\` foreign key (\`projectId\`) references \`Project\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`Prompt\` add constraint \`Prompt_projectId_foreign\` foreign key (\`projectId\`) references \`Project\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`Prompt\` add constraint \`Prompt_templateId_foreign\` foreign key (\`templateId\`) references \`PromptTemplate\` (\`id\`) on update cascade on delete set null;`);

    this.addSql(`alter table \`Rendering\` add constraint \`Rendering_projectId_foreign\` foreign key (\`projectId\`) references \`Project\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`Rendering\` add constraint \`Rendering_promptId_foreign\` foreign key (\`promptId\`) references \`Prompt\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`Moodboard\` add constraint \`Moodboard_projectId_foreign\` foreign key (\`projectId\`) references \`Project\` (\`id\`) on update cascade;`);
  }

}
exports.Migration20260306041732 = Migration20260306041732;
