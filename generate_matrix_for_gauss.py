import random
file_name = "matrices.txt"
start_row = 2
end_row = 200
examples_of_each_dimension = 5
chance_of_zero = 50
lowest_num = -100
highest_num = 100

def generate_matrix(rows, cols):
  mat = [[0]*cols for _ in range(rows)]
  #
  for rowI in range(rows):
    for colI in range(cols):
      if rowI == colI:
        percent_for_zero = random.randint(0, 100)
        if percent_for_zero > chance_of_zero:
          mat[rowI][colI] = random.randint(lowest_num, highest_num)
        else:
          mat[rowI][colI]
      else:
        mat[rowI][colI] = random.randint(lowest_num, highest_num)
  return mat

def write_matrix_to_file(f, m):
  f.write(str(len(m))+" "+str(len(m[0]))+"\n")
  for row in m:
    for val in row:
      f.write(str(val)+" ")
    f.write("\n")

with open(file_name, "a") as f:
  #the num of rows to start with through the num of rows in the last matrix
  for num_rows in range(start_row, end_row+1):
    print("CONSTRUCTING MATRICES WITH ", num_rows, " ROWS AND ", num_rows+1, " COLUMNS")
    #the matrix is generated with the number of rows speficied by the loop above and one extra column
    for _ in range(examples_of_each_dimension):
      m = generate_matrix(num_rows, num_rows+1)
      write_matrix_to_file(f, m)
  f.close()