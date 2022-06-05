﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Projekat.Data;

#nullable disable

namespace Projekat.Migrations
{
    [DbContext(typeof(MySqlDbContext))]
    [Migration("20220605225914_pk")]
    partial class pk
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("Projekat.Modeli.DataModel", b =>
                {
                    b.Property<string>("userID")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("FileName")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Putanja")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("VremeUploada")
                        .HasColumnType("datetime(6)");

                    b.HasKey("userID", "FileName");

                    b.ToTable("Files");
                });

            modelBuilder.Entity("Projekat.Modeli.Korisnik", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<bool>("EmailPotvrdjen")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("EmailToken")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<byte[]>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("longblob");

                    b.Property<byte[]>("PasswordSalt")
                        .IsRequired()
                        .HasColumnType("longblob");

                    b.Property<string>("ProfileImage")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("varchar(20)");

                    b.HasKey("ID");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("Username")
                        .IsUnique();

                    b.ToTable("Korisnici");
                });

            modelBuilder.Entity("Projekat.Modeli.SavedModelsModel", b =>
                {
                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.Property<string>("ModelID")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("ModelName")
                        .HasColumnType("varchar(255)");

                    b.Property<DateTime>("DateSaved")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("UserID", "ModelID", "ModelName");

                    b.ToTable("SavedModels");
                });
#pragma warning restore 612, 618
        }
    }
}
