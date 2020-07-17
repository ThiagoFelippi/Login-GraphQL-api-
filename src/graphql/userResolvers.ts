import { User } from '../entity/User';
import { Resolver, Mutation, Arg, Query } from 'type-graphql'
import bcrypt from 'bcryptjs'

@Resolver()
export class userResolver{

  @Query(() => [User])
  async getUsers(){
    return await User.find()
  }

  @Mutation(() => User)
  async register(
    @Arg("email", () => String) email: string, 
    @Arg("password", () => String) password: string
  ){
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      email,
      password: hashedPassword
    }).save()
    return user
  }
}